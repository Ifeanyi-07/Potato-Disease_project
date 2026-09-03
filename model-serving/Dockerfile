FROM tensorflow/serving

COPY models /models/potato_model

COPY start.sh /start.sh

RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]