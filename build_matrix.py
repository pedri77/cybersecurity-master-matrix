#!/usr/bin/env python3
"""
build_matrix.py — Generate matrix.json from CSV source files.

Usage:
    python3 build_matrix.py              # Build matrix.json
    python3 build_matrix.py --validate   # Validate only (no write)

Reads from data/*.csv, writes to data/matrix.json.
Validates referential integrity, duplicates, and coverage.
"""

import csv
import json
import sys
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
OUTPUT = os.path.join(DATA_DIR, 'matrix.json')

ERRORS = []
WARNINGS = []


def error(msg):
    ERRORS.append(msg)
    print(f"  ERROR: {msg}", file=sys.stderr)


def warn(msg):
    WARNINGS.append(msg)
    print(f"  WARN:  {msg}", file=sys.stderr)


def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        error(f"File not found: {filename}")
        return []
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = [dict(row) for row in reader]
    print(f"  {filename}: {len(rows)} rows")
    return rows


def validate(domains, categories, providers, products, cat_prov_map,
             capabilities, product_caps, product_sources):
    """Validate referential integrity and data quality."""

    print("\n--- Validation ---")

    domain_ids = {d['ID'] for d in domains}
    category_ids = {c['ID categoría'] for c in categories}
    provider_names = {p['Proveedor'] for p in providers}

    # Categories reference valid domains
    for c in categories:
        if c['ID dominio'] not in domain_ids:
            error(f"Category {c['ID categoría']} references unknown domain {c['ID dominio']}")

    # Category-provider map references valid categories
    map_cat_ids = set()
    map_providers = set()
    for m in cat_prov_map:
        cid = m['ID categoría']
        prov = m['Proveedor representativo']
        map_cat_ids.add(cid)
        map_providers.add(prov)
        if cid not in category_ids:
            error(f"Map references unknown category {cid}")

    # Products reference valid categories
    product_cat_ids = set()
    product_providers = set()
    seen_products = set()
    unique_products = set()
    for p in products:
        cid = p['ID categoría']
        prov = p['Proveedor']
        product_cat_ids.add(cid)
        product_providers.add(prov)
        unique_products.add(f"{prov}|{p['Producto']}")
        key = p.get('ID producto', '')
        if key in seen_products:
            error(f"Duplicate product ID: {key}")
        seen_products.add(key)
        if cid not in category_ids:
            error(f"Product {key} references unknown category {cid}")

    # Product capabilities reference valid products
    cap_products = set()
    for pc in product_caps:
        key = f"{pc['Proveedor']}|{pc['Producto']}"
        cap_products.add(key)
        # Check column count
        cap_count = sum(1 for i in range(1, 21)
                        if pc.get(f'CAP{i:03d}', '').strip())
        if cap_count == 0:
            warn(f"Product {pc['Proveedor']} - {pc['Producto']} has 0 capabilities filled")

    # Product sources reference valid products
    for s in product_sources:
        key = f"{s['Proveedor']}|{s['Producto']}"
        if key not in unique_products:
            warn(f"Source references unknown product: {s['Proveedor']} - {s['Producto']}")

    # Coverage stats
    cats_with_products = product_cat_ids & category_ids
    cats_without = category_ids - product_cat_ids
    provs_in_map_not_csv = map_providers - provider_names
    products_without_caps = unique_products - cap_products

    print(f"\n  Categories with products: {len(cats_with_products)}/{len(category_ids)}")
    if cats_without:
        warn(f"Categories without products: {', '.join(sorted(cats_without))}")

    print(f"  Unique products: {len(unique_products)}")
    print(f"  Products with capabilities: {len(cap_products)}/{len(unique_products)}")
    if products_without_caps and len(products_without_caps) <= 10:
        warn(f"Products without capabilities: {len(products_without_caps)}")

    print(f"  Product sources: {len(product_sources)}")
    print(f"  Providers in map but not in providers.csv: {len(provs_in_map_not_csv)}")
    if provs_in_map_not_csv and len(provs_in_map_not_csv) <= 5:
        for p in sorted(provs_in_map_not_csv):
            warn(f"Provider in map but not in CSV: {p}")

    # Tier distribution
    tier_counts = {}
    for p in providers:
        t = p.get('Tier', 'Unknown')
        tier_counts[t] = tier_counts.get(t, 0) + 1
    print(f"  Tiers: {tier_counts}")

    # URL coverage
    urls = sum(1 for p in products if p.get('URL', '').strip())
    print(f"  Products with URLs: {urls}/{len(products)} rows ({len(set(p['Proveedor']+'|'+p['Producto'] for p in products if p.get('URL','').strip()))} unique)")

    return len(ERRORS) == 0


def build(domains, categories, providers, products, cat_prov_map,
          capabilities, product_caps, product_sources):
    """Build matrix.json from CSV data."""

    # Count unique products
    seen = set()
    unique_count = 0
    for p in products:
        key = f"{p['Proveedor']}|{p['Producto']}"
        if key not in seen:
            seen.add(key)
            unique_count += 1

    # Tier distribution
    tier_counts = {}
    for p in providers:
        t = p.get('Tier', 'Unknown')
        tier_counts[t] = tier_counts.get(t, 0) + 1

    # URLs count
    url_products = set()
    for p in products:
        if p.get('URL', '').strip():
            url_products.add(f"{p['Proveedor']}|{p['Producto']}")

    db = {
        'meta': {
            'version': '1.0',
            'domains': len(domains),
            'categories': len(categories),
            'providers': len(providers),
            'relations': len(cat_prov_map),
            'products': len(products),
            'unique_products': unique_count,
            'products_with_capabilities': len(product_caps),
            'product_sources': len(product_sources),
            'products_with_url': len(url_products),
            'tiers': tier_counts
        },
        'domains': domains,
        'categories': categories,
        'providers': providers,
        'map': cat_prov_map,
        'products': products,
        'capabilities': capabilities,
        'productCapabilities': product_caps,
        'productSources': product_sources
    }

    return db


def main():
    validate_only = '--validate' in sys.argv

    print("Loading CSVs...")
    domains = read_csv('domains.csv')
    categories = read_csv('categories.csv')
    providers = read_csv('providers.csv')
    products = read_csv('products.csv')
    cat_prov_map = read_csv('category-provider-map.csv')
    capabilities = read_csv('capabilities.csv')
    product_caps = read_csv('product-capabilities.csv')
    product_sources = read_csv('product-sources.csv')

    ok = validate(domains, categories, providers, products, cat_prov_map,
                  capabilities, product_caps, product_sources)

    print(f"\n--- Result ---")
    print(f"  Errors: {len(ERRORS)}")
    print(f"  Warnings: {len(WARNINGS)}")

    if not ok:
        print("\n  VALIDATION FAILED. Fix errors before building.")
        sys.exit(1)

    if validate_only:
        print("\n  Validation passed. (--validate mode, no write)")
        sys.exit(0)

    db = build(domains, categories, providers, products, cat_prov_map,
               capabilities, product_caps, product_sources)

    # Write compact JSON (no indent) to reduce file size
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, separators=(',', ':'))

    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f"\n  Written: {OUTPUT} ({size_kb:.0f} KB)")
    print("  Done.")


if __name__ == '__main__':
    main()
