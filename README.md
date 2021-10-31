# Счетчик скорости
- Счетчик реализован в файле send.js, его модифицировать не нужно
- Пример работы со счетчиком показан в send.html

## Решение

https://iskhakov-public.github.io/shri-performance/stats.html - Страница со статистикой
https://iskhakov-public.github.io/shri-performance/application.html - Страница с приложением
https://github.com/iskhakov-public/shri-performance - репозиторий

Сделаны метрики:
- first-paint
- first-contentful-paint
- pageloadtime
- ttfb
- connect
- render-add - время рендера списка задач
- render-add-by-one - среднее время рендера одной задачи (время рендера списка задач поделенного на число задач)
- render-drop - время рендера при удалении одной задачи
- resptime-send.js - response time файла send.js (Resource Timing API)
- resptime-tailwind.min.css - response time файла tailwind.css (Resource Timing API)

Для просмотра открыть консоль https://iskhakov-public.github.io/shri-performance/stats.html

# ДЗ

## Добавить сбор метрик на свой проект
- Подключить send.js на свой проект
- Прислать ссылку на файл, где собираются метрики
- Если отправка раскидана по коду проекта, то прислать ссылки на эти места (возможно, просто ссылка на поиск по проекту)

## Реализовать сбор и анализ этих данных
- Прислать ссылку на GitHub Pages файла, где в консоли будет выводиться вся необходимая информация по сценариям анализа данных. [Пример](https://newbfg.github.io/shri-performance/stats.html)
- Реализовать сами сценарии
