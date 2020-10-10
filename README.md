# TapTab

> Like `crontab` but `taptab`

```bash
npm i
```


Configure your tap bindings

```bash
vi ./taptab.rc
```

FORMAT:
`<NUMBER><TYPE>=<COMMAND>`

TYPE:

    - `S` - short tap (<= 300ms)
    - `L` - long tap (> 300ms)

EXAMPLE:
```
1L2S=shutdown now
2L1S=shutdown -r now
```


```bash
GPIO_PIN=0 npm start
```

AVAILABLE ENVIRONMENT VARIABLES:

```
GPIO_PIN [required]
CONFIG_FILE [default=./taptab.rc]
RESET_INTERVAL_TICKS [default=100]
ONE_TICK_MS [default=30]
```
