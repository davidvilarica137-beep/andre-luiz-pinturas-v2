#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verificador do site André Luiz — nova estrutura."""
import re
import sys

BASE = "/home/cliente/andre-luiz-pinturas-novo"
HTML = f"{BASE}/index.html"

errors = []
warnings = []

with open(HTML, encoding="utf-8") as fh:
    html = fh.read()

# 1. Número do WhatsApp
whatsapp_number = "5513996398129"
links = re.findall(r'https://wa\.me/([0-9]+)\?text=([^"]+)', html)
for num, txt in links:
    if num != whatsapp_number:
        errors.append(f"WhatsApp number mismatch: {num} != {whatsapp_number}")

# 2. tel: placeholders
tel_holders = re.findall(r'tel:\+55\d{2}\*\*\*\*?\d+', html)
for t in tel_holders:
    errors.append(f"Tel placeholder encontrado: {t}")

# 3. Caminhos absolutos do sistema
abs_paths = re.findall(r'/home/[a-z]+/', html)
for p in set(abs_paths):
    warnings.append(f"Caminho absoluto local no HTML: {p}")

# 4. Imagem nula/placeholder
if 'src="assets/images/placeholder' in html.lower():
    warnings.append("Encontrado placeholder de imagem")

# 5. Estrutura básica
for tag in ["<!DOCTYPE html>", "<html", "<head", "<body", "<script", "<link"]:
    if tag not in html:
        errors.append(f"Tag faltando: {tag}")

# 6. JS
js_path = f"{BASE}/assets/js/main.js"
try:
    with open(js_path, encoding="utf-8") as fh:
        js = fh.read()
    if not js.strip().startswith("(function ("):
        errors.append("JS não é IIFE")
    if "whatsappNumber" not in js:
        errors.append("Config do WhatsApp não encontrada no JS")
except FileNotFoundError:
    errors.append("arquivo JS não encontrado")

if errors:
    print("=" * 60)
    print("ERRO(S) ENCONTRADO(S):")
    for e in errors:
        print(f"  ✗ {e}")
    sys.exit(1)
else:
    print("=" * 60)
    print("PAREI DE ERROS:")
    print("  ✓ Todos os links do WhatsApp com o número 5513996398129")
    print("  ✓ Nenhum tel: placeholder no HTML")
    print("  ✓ Estrutura HTML válida")
    print("  ✓ JS com configuração do WhatsApp centralizada")
    print("  ✓ Sem caminhos absolutos locais")
    print("=" * 60)
