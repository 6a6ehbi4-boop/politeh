# Пластинчатый теплообменник — интерактивная модель (Politeh)

Демонстрационное React-приложение для кафедры теплотехники: связь входных параметров с выходными в модели ПТО.

## Запуск с GitHub (GitHub Pages)

После пуша в ветку `main` (при изменении файлов в `Politeh/` или этого workflow) приложение автоматически собирается и публикуется на GitHub Pages.

1. В репозитории: **Settings → Pages** → Source: **GitHub Actions**.
2. После успешного workflow приложение откроется по адресу:  
   `https://<ваш-логин>.github.io/<имя-репозитория>/`

Локально тот же билд: в папке `Politeh` задайте `BASE_PATH=/имя-репозитория/` и выполните `npm run build` (для проверки путей).

## Запуск локально

```bash
cd Politeh
npm install
npm run dev
```

Откройте в браузере адрес, который выведет Vite (обычно http://localhost:5173).

## Сборка

```bash
npm run build
npm run preview
```

## Структура

- `src/calc/calculateHeatExchanger.ts` — чистая функция расчёта ПТО (тепловой баланс, ограничение по F·k).
- `src/hooks/useTemperatureColor.ts` — хук: температура → цвет (градиент синий–красный).
- `src/components/HeatExchangerScheme.tsx` — схема ПТО и четыре трубопровода с подписями.
- `src/components/ControlPanel.tsx` — ползунки и поля ввода (Tг1, Gг, Tх1, Gх).
- `src/components/ResultsPanel.tsx` — расчётные параметры (Tг2, Tх2, Q, Δtг, Δtх, запас).
- `src/components/GraphPanel.tsx` — график зависимости Tх2 и Q от выбранного параметра (Recharts).

Стек: Vite, React 18, TypeScript, Tailwind CSS, Recharts, Framer Motion.
