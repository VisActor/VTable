{{ target: календарь }}

# календарь

гантт график configuration, the corresponding тип is календарьConstructorOptions, the specific configuration items are as follows:

## startDate(Date)

The начало date из the календарь.

## endDate(Date)

The конец date из the календарь.

## currentDate(Date)

The текущий date из the календарь.

## rangeDays(число)

The date range displayed в the календарь (if startDate&endDate is не configured, the dates before и after rangeDays will be taken от currentDate as startDate&endDate, the по умолчанию is 90 days).

## dayTitles(строка[])

The title из the календарь (can be replaced с different languвозрастs).

## пользовательскийсобытиеOptions(IпользовательскийсобытиеOptions)

Configuration из пользовательский schedules.

{{ use: common-календарь-пользовательский-событие-option(prefix = '###') }}

## пользовательскийсобытиеs(Iпользовательскийсобытие[])

массив из пользовательский событиеs.

{{ use: common-календарь-пользовательский-событие(prefix = '###') }}

## таблицаOptions(списоктаблицаConstructorOptions)

календарь таблица configuration (the configuration here will be passed к the corresponding Vтаблица instance для deep пользовательскийization).