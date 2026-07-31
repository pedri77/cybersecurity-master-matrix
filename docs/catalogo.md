# Catálogo global de ciberseguridad

**Versión:** 1.0  
**Estado:** Base inicial mantenible

- 20 dominios
- 122 categorías
- 343 proveedores únicos
- 668 relaciones categoría–proveedor

## Network Security

Seguridad de red, perímetro, acceso y tráfico

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C001 | Enterprise Firewall / NGFW | Prevención y control de tráfico de red | Alta |
| C002 | Secure Service Edge (SSE) | SWG, CASB, ZTNA y FWaaS desde la nube | Alta |
| C003 | SASE | Convergencia de red WAN y seguridad cloud | Alta |
| C004 | Zero Trust Network Access | Acceso contextual a aplicaciones privadas | Alta |
| C005 | Web Application & API Protection | WAF, bot management, DDoS y API protection | Alta |
| C006 | DDoS Protection | Mitigación de ataques volumétricos y de aplicación | Alta |
| C007 | Network Detection & Response | Analítica de tráfico y detección de amenazas | Alta |
| C008 | Network Access Control | Control de acceso a red y postura de dispositivos | Media |
| C009 | DNS Security | Protección DNS, filtrado y detección | Media |
| C010 | Microsegmentation | Segmentación basada en identidad y workload | Media |

## Identity Security

Identidad, autenticación, privilegios y gobierno de acceso

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C011 | Identity and Access Management | Autenticación, SSO y gestión de acceso | Alta |
| C012 | Identity Governance & Administration | Altas, bajas, recertificación y gobierno | Alta |
| C013 | Privileged Access Management | Control y monitorización de privilegios | Alta |
| C014 | Customer IAM | Identidad y acceso de clientes | Alta |
| C015 | Identity Threat Detection & Response | Detección de ataques y anomalías de identidad | Alta |
| C016 | Passwordless Authentication | FIDO2, passkeys y autenticación sin contraseña | Media |
| C017 | Machine Identity Management | Identidades de cargas, máquinas y servicios | Alta |
| C018 | Authentication Security | MFA adaptativo y autenticación contextual | Alta |

## Endpoint Security

Protección, detección y respuesta en endpoints

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C019 | Endpoint Protection Platform | Prevención de malware y explotación | Alta |
| C020 | Endpoint Detection & Response | Detección, investigación y respuesta endpoint | Alta |
| C021 | Extended Detection & Response | Correlación multi-dominio y respuesta | Alta |
| C022 | Mobile Threat Defense | Protección de dispositivos móviles | Media |
| C023 | Endpoint Privilege Management | Mínimo privilegio en endpoints | Media |
| C024 | Application Control / Allowlisting | Control de ejecución y lista blanca | Media |

## Cloud Security

Protección de infraestructura, cargas y configuraciones cloud

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C025 | Cloud-Native Application Protection Platform | CNAPP: CSPM, CWPP, CIEM y código | Alta |
| C026 | Cloud Security Posture Management | Configuración y cumplimiento cloud | Alta |
| C027 | Cloud Workload Protection | Protección de workloads, contenedores y serverless | Alta |
| C028 | Cloud Infrastructure Entitlement Management | Permisos y privilegios cloud | Media |
| C029 | Kubernetes & Container Security | Seguridad runtime y configuración de contenedores | Alta |
| C030 | Cloud Detection & Response | Detección y respuesta específica de cloud | Media |

## Data Security

Descubrimiento, clasificación, protección y cifrado de datos

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C031 | Data Loss Prevention | Prevención de fuga de información | Alta |
| C032 | Data Security Posture Management | Descubrimiento y riesgo de datos sensibles | Alta |
| C033 | Data Classification & Discovery | Inventario y etiquetado de información | Alta |
| C034 | Database Activity Monitoring | Monitorización y protección de bases de datos | Media |
| C035 | Tokenization & Data Masking | Protección de datos mediante sustitución y enmascarado | Media |
| C036 | Enterprise Encryption | Cifrado de datos en reposo, tránsito y uso | Alta |
| C037 | Confidential Computing | Protección de datos en uso mediante TEEs | Media |

## Application Security

Seguridad del ciclo de vida de software y aplicaciones

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C038 | Static Application Security Testing | Análisis estático de código | Alta |
| C039 | Dynamic Application Security Testing | Pruebas dinámicas de aplicaciones | Alta |
| C040 | Software Composition Analysis | Dependencias y vulnerabilidades open source | Alta |
| C041 | Application Security Posture Management | Orquestación, priorización y gobierno AppSec | Alta |
| C042 | API Security | Descubrimiento, postura y protección de APIs | Alta |
| C043 | Software Supply Chain Security | Integridad de build, artefactos y pipeline | Alta |
| C044 | Secrets Management | Gestión de secretos de aplicaciones y máquinas | Alta |
| C045 | Runtime Application Self-Protection | Defensa embebida en runtime | Media |
| C046 | Web Application Security Testing | Pentesting automatizado y validación continua | Media |

## Security Operations

Operación SOC, detección, respuesta y automatización

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C047 | Security Information & Event Management | Ingesta, correlación, investigación y reporting | Alta |
| C048 | Security Orchestration Automation & Response | Automatización y orquestación SOC | Alta |
| C049 | Security Operations Platform | Plataforma unificada SOC y SecOps | Alta |
| C050 | Detection Engineering | Gestión del ciclo de vida de reglas y detecciones | Alta |
| C051 | Security Automation | Automatización low-code/no-code de seguridad | Alta |
| C052 | User & Entity Behavior Analytics | Analítica de comportamiento y anomalías | Media |
| C053 | Digital Forensics & Incident Response Platforms | Investigación, forense y gestión de incidentes | Media |
| C054 | Security Case Management | Gestión de casos, evidencias y workflows SOC | Media |

## Threat Intelligence

Inteligencia, fuentes, plataformas y análisis de amenazas

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C055 | Threat Intelligence Platform | Agregación, normalización y operacionalización CTI | Alta |
| C056 | Commercial Threat Intelligence | Fuentes y análisis de inteligencia de pago | Alta |
| C057 | Open Source Threat Intelligence | Plataformas y fuentes abiertas de inteligencia | Alta |
| C058 | Digital Risk Protection Intelligence | Dark web, credenciales, fraude y exposición externa | Alta |
| C059 | Malware Intelligence | Análisis, sandboxing y conocimiento de malware | Alta |
| C060 | Brand & Domain Intelligence | Dominios, suplantación y abuso de marca | Media |

## Exposure Management

Gestión continua de exposición y superficie de ataque

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C061 | External Attack Surface Management | Descubrimiento continuo de activos externos | Alta |
| C062 | Continuous Threat Exposure Management | Programa continuo de exposición y priorización | Alta |
| C063 | Vulnerability Management | Descubrimiento y gestión de vulnerabilidades | Alta |
| C064 | Risk-Based Vulnerability Management | Priorización basada en explotación, activos y riesgo | Alta |
| C065 | Breach & Attack Simulation | Validación automatizada de controles | Alta |
| C066 | Automated Security Validation | Validación continua de rutas y controles | Alta |
| C067 | Cyber Asset Attack Surface Management | Inventario y relación de activos y exposiciones | Alta |
| C068 | Security Ratings | Riesgo externo de organizaciones y terceros | Media |

## Governance, Risk & Compliance

Gobierno, riesgo, cumplimiento, auditoría y evidencias

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C069 | Enterprise GRC | Gobierno, riesgo, controles, auditoría y cumplimiento | Alta |
| C070 | IT Risk Management | Riesgo tecnológico y controles | Alta |
| C071 | Third-Party Risk Management | Riesgo de proveedores y cadena de suministro | Alta |
| C072 | Continuous Controls Monitoring | Monitorización automatizada de controles | Alta |
| C073 | Cyber Risk Quantification | Cuantificación económica del riesgo cibernético | Media |
| C074 | Audit Management | Planificación, evidencias y ejecución de auditorías | Alta |
| C075 | Business Continuity Management | Continuidad, resiliencia y crisis | Media |
| C076 | Security Compliance Automation | Automatización de evidencias y certificaciones | Alta |

## Privacy

Gobierno de privacidad y protección de datos personales

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C077 | Privacy Management | Inventario, evaluaciones y gobierno de privacidad | Alta |
| C078 | Consent & Preference Management | Consentimiento, cookies y preferencias | Alta |
| C079 | Data Subject Rights Automation | Automatización de derechos de interesados | Media |
| C080 | Privacy Enhancing Technologies | Minimización, anonimización y computación privada | Media |

## AI Security

Protección, gobierno y evaluación de sistemas de IA

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C081 | AI Trust, Risk & Security Management | Gobierno, riesgo, seguridad y confianza de IA | Alta |
| C082 | AI Security Posture Management | Inventario y postura de modelos, datos y pipelines | Alta |
| C083 | AI Runtime Security | Protección de aplicaciones y agentes en ejecución | Alta |
| C084 | LLM / GenAI Red Teaming | Evaluación adversarial de modelos y aplicaciones | Alta |
| C085 | AI Governance Platforms | Inventario, políticas, evidencias y cumplimiento AI Act | Alta |
| C086 | AI Gateway & Model Firewall | Control, observabilidad y seguridad de acceso a modelos | Alta |
| C087 | Model Supply Chain Security | Integridad de modelos, datasets y artefactos ML | Media |

## OT / IoT / CPS Security

Protección de entornos industriales, IoT y sistemas ciberfísicos

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C088 | OT Security Platform | Visibilidad, segmentación y detección industrial | Alta |
| C089 | OT Network Detection & Response | Detección de amenazas en redes industriales | Alta |
| C090 | IoT Security | Descubrimiento y protección de dispositivos IoT | Alta |
| C091 | Medical Device Security | Inventario y riesgo de dispositivos médicos | Media |
| C092 | Automotive Cybersecurity | Seguridad de vehículos conectados y software | Media |

## Email & Collaboration Security

Protección de correo, colaboración y fraude por mensajería

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C093 | Email Security | Protección de correo, phishing y malware | Alta |
| C094 | Integrated Cloud Email Security | Seguridad API para Microsoft 365 y Google Workspace | Alta |
| C095 | DMARC & Domain Protection | Autenticación y protección del dominio de correo | Media |
| C096 | Collaboration Security | Protección de Teams, Slack, Drive y colaboración | Media |

## Digital Risk & Fraud

Riesgo digital, fraude, identidad externa y abuso de marca

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C097 | Fraud Detection & Prevention | Detección de fraude digital y transaccional | Alta |
| C098 | Account Takeover Prevention | Protección frente a secuestro de cuentas | Alta |
| C099 | Bot Management | Detección y mitigación de bots maliciosos | Alta |
| C100 | Brand Protection | Detección y retirada de abuso de marca | Media |

## Managed Security Services

Servicios gestionados de detección, respuesta y operación

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C101 | Managed Detection & Response | Detección y respuesta operada 24x7 | Alta |
| C102 | Managed SIEM / SOC | Operación gestionada de SIEM y SOC | Alta |
| C103 | Managed Cloud Security | Operación y protección cloud gestionada | Media |
| C104 | Incident Response Retainer | Respuesta a incidentes bajo retainer | Alta |

## Hardware Security

Raíces de confianza, módulos seguros y hardware criptográfico

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C105 | Hardware Security Module | Generación y custodia de claves en hardware | Alta |
| C106 | Trusted Platform Module | Raíz de confianza de dispositivo | Media |
| C107 | Secure Enclave / TEE | Ejecución aislada y protección de secretos | Media |
| C108 | Smart Cards & Security Tokens | Autenticación y firma mediante hardware | Media |

## Enterprise Cryptography

Criptografía empresarial, PKI, claves, secretos y certificados

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C109 | Enterprise Key Management | Gestión centralizada del ciclo de vida de claves | Alta |
| C110 | Public Key Infrastructure | Emisión, validación y gobierno de certificados | Alta |
| C111 | Certificate Lifecycle Management | Descubrimiento y automatización de certificados | Alta |
| C112 | Secrets Management | Custodia y rotación de secretos | Alta |
| C113 | Code Signing | Firma y protección de software y artefactos | Media |
| C114 | Crypto Agility Management | Inventario criptográfico y migración algorítmica | Alta |

## Post-Quantum Security

Descubrimiento, migración y protección poscuántica

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C115 | Post-Quantum Cryptography Discovery | Descubrimiento de criptografía vulnerable | Alta |
| C116 | PQC Migration & Crypto Agility | Planificación y ejecución de migración poscuántica | Alta |
| C117 | Quantum Key Distribution | Distribución cuántica de claves | Media |
| C118 | Quantum Random Number Generation | Generación cuántica de aleatoriedad | Media |

## Security Consulting & Assurance

Consultoría, auditoría, red teaming y respuesta a incidentes

| ID | Categoría | Objetivo | Prioridad |
|---|---|---|---|
| C119 | Cybersecurity Consulting | Estrategia, arquitectura y transformación | Alta |
| C120 | Penetration Testing & Red Teaming | Pruebas ofensivas y validación humana | Alta |
| C121 | Cybersecurity Audit & Certification | Auditoría y certificación de controles y normas | Alta |
| C122 | Digital Forensics | Forense digital y soporte pericial | Media |
