#!/bin/sh
# Script de build alternativo para Render
# Este script copia el frontend a nginx antes del build

echo "Copiando frontend a nginx..."
cp -r ../frontend ./frontend-build

echo "Build completado"

