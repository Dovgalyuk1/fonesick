# fone sick ($FONE)

Статический лендинг под мемкоин $FONE. Чистый HTML/CSS/JS, без сборки.

## Деплой
Просто загрузить содержимое папки как статический сайт (GitHub → Vercel Import, preset "Other", без build command).

## Что вписать при запуске
В `script.js` в объекте `CONFIG`:
- `CA` — адрес контракта
- `BUY_URL` — ссылка на покупку (pump.fun/dex)
- `CHART_URL` — ссылка на Dexscreener
- `X_URL`, `TELEGRAM_URL` — соцсети

После заполнения `CA` статистика (цена/капа/ликвидность/объём) подтянется сама с DexScreener.
