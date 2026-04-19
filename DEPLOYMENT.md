# 🚀 Deployment Guide - NEURALCOSMOLOGY

Руководство по развертыванию сайта NEURALCOSMOLOGY на различных платформах.

## 🔥 Быстрый запуск

### Локальная разработка

```bash
# 1. Клонируйте репозиторий (если нужно)
git clone <repository-url>
cd neurocosmology

# 2. Установите зависимости
npm install

# 3. Запустите сервер разработки
npm run dev
```

Сайт будет доступен по адресу: http://localhost:3000

## 🐳 Docker развертывание (Основной способ)

### Автоматическое развертывание через GitHub Actions

Проект использует GitHub Actions для автоматического деплоя. При каждом push в ветку `main` происходит:

1. **Сборка Docker образа** на GitHub Actions runner
2. **Пуш образа** в Docker Hub
3. **Деплой на сервер** через self-hosted runner

#### Настройка GitHub Secrets

В настройках репозитория GitHub добавьте следующие secrets:

- `DOCKERHUB_USERNAME` - ваш Docker Hub username
- `DOCKERHUB_TOKEN` - токен Docker Hub (создайте в Docker Hub → Account Settings → Security)

#### Настройка Self-Hosted Runner

На сервере должен быть настроен self-hosted GitHub Actions runner:

```bash
# На сервере
cd /opt
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN
sudo ./svc.sh install
sudo ./svc.sh start
```

#### Traefik должен быть запущен отдельно

Traefik должен быть запущен на сервере отдельно и создавать сеть `traefik-global`:

```bash
# Создайте сеть если её нет
docker network create traefik-global
```

#### Ручной деплой

Для ручного деплоя используйте workflow `Manual Deploy` в GitHub Actions:
- Перейдите в Actions → Manual Deploy
- Нажмите "Run workflow"
- Выберите окружение (production/staging)

## 🔒 SSL и домены

### Настройка DNS для neuralcosmology.com

```
Type: A
Name: @
Value: [YOUR_SERVER_IP]

Type: A  
Name: www
Value: [YOUR_SERVER_IP]
```

### Автоматический SSL через Let's Encrypt

Traefik автоматически получает SSL сертификаты для всех доменов.

## 📊 Мониторинг

### Логи контейнеров
```bash
# На сервере в директории проекта
cd /opt/projects/neurocosmology

# Просмотр логов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f neurocosmology
```

### Статус сервисов
```bash
# Проверка статуса
cd /opt/projects/neurocosmology
docker-compose ps

# Перезапуск сервиса
docker-compose restart neurocosmology
```

## 🔧 Troubleshooting

### Частые проблемы

1. **Проблемы с SSL:**
   ```bash
   # Проверьте что Traefik запущен и настроен правильно
   docker ps | grep traefik
   
   # Проверьте логи Traefik
   docker logs traefik
   ```

2. **Ошибки сборки:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

3. **Проблемы с портами:**
   ```bash
   # Убедитесь что порты 80, 443, 8080 свободны
   sudo netstat -tulpn | grep -E ':(80|443|8080)'
   ```

### Бэкап и восстановление

```bash
# Создание бэкапа
cd /opt/projects/neurocosmology
docker-compose exec neurocosmology tar czf /tmp/backup.tar.gz /app

# Восстановление
docker cp neurocosmology:/tmp/backup.tar.gz ./backup.tar.gz
```

## 🎯 Производство

### Оптимизация производительности

1. **Сжатие изображений автоматическое** через Next.js Image
2. **Кэширование** настроено через Traefik
3. **Gzip сжатие** включено в Docker
4. **Минификация** CSS/JS через Next.js

### Безопасность

1. **HTTPS принудительно** через Traefik
2. **Базовая аутентификация** для Traefik dashboard
3. **Обновления безопасности** Docker образов
4. **CSP заголовки** настроены

---

🎉 **Поздравляем!** Ваш сайт NEURALCOSMOLOGY готов к развертыванию!

🌐 **Доступные адреса:**
- https://neuralcosmology.com
- https://www.neuralcosmology.com




