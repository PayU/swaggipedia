CONTAINER_INITIALIZED="CONTAINER_INITIALIZED_SUCCESSFULLY"
if [ ! -e ./scripts/$CONTAINER_INITIALIZED ]; then
    echo "=================================================="
    echo "(-) Initializing swaggipedia UI for the first time"
    echo "=================================================="
    node ./scripts/initialize-ui.js

    if [ $? -eq 0 ]; then
        touch ./scripts/$CONTAINER_INITIALIZED
        echo "==========================================="
        echo "(✓) Swaggipedia UI initialized successfully"
        echo "==========================================="
    else
        echo "======================================="
        echo "(!) Failed to initialize swaggipedia UI"
        echo "======================================="
    fi
fi