#!/bin/bash

# Setup secrets for Cloudflare Workers deployment
# This script reads from .dev.vars and sets up secrets in Cloudflare Workers

echo "Setting up Cloudflare Workers secrets..."

# Check if .dev.vars file exists
if [ ! -f ".dev.vars" ]; then
    echo "Warning: .dev.vars file not found. Please create it from .dev.vars.example"
    echo "Skipping secret setup..."
    exit 0
fi

# Function to set a secret if the environment variable exists and is not empty
set_secret_if_exists() {
    local var_name=$1
    local value=$(grep "^${var_name}=" .dev.vars | cut -d '=' -f2- | tr -d '"')
    
    if [ -n "$value" ] && [ "$value" != "your_${var_name,,}_here" ]; then
        echo "Setting secret: $var_name"
        echo "$value" | wrangler secret put "$var_name" --env production
    else
        echo "Skipping $var_name (not set or using placeholder value)"
    fi
}

# Set secrets for production deployment
echo "Setting up secrets for production environment..."

set_secret_if_exists "CLOUDFLARE_ACCOUNT_ID"
set_secret_if_exists "CLOUDFLARE_DATABASE_ID"
set_secret_if_exists "CLOUDFLARE_D1_TOKEN"
set_secret_if_exists "NEXT_PUBLIC_STACK_PROJECT_ID"
set_secret_if_exists "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY"
set_secret_if_exists "STACK_SECRET_SERVER_KEY"
set_secret_if_exists "NEXTAUTH_URL"
set_secret_if_exists "NEXTAUTH_SECRET"
set_secret_if_exists "TURSO_DATABASE_URL"
set_secret_if_exists "TURSO_AUTH_TOKEN"

echo "Secret setup completed!"