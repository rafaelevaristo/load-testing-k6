# load-testing-k6

## Runing the stuff
``` bash
docker compose up -d
```

## runing the tests after infra up
``` bash
docker compose run --rm k6
```

## taking all down
``` bash
docker compose down -d
```

# Using CrApi

## run tests
``` bash
docker compose -f docker-compose-crapi-oficial.yml up -d
```

## run tests
``` bash
docker compose -f docker-compose-crapi-oficial.yml run --rm k6
```

## run tests
``` bash
docker compose -f docker-compose-crapi-oficial.yml down
```