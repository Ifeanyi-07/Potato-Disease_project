#!/bin/sh

tensorflow_model_server \
    --rest_api_port="${PORT:-8501}" \
    --port=8500 \
    --model_name=potato_model \
    --model_base_path=/models/potato_model