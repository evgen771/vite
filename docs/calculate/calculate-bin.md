# Собирать все из исходиков:

Бинарность лечится раскомментированием `FEATURES="-getbinpkg"` в `/etc/portage/make.conf/custom`

Чтобы заставить собирать нужный пакет, с нужными флагами, из исходников можно указать:

`FEATURES=-getbinpkg` перед `emerge -a firefox`

Например:

`FEATURES=-getbinpkg emerge -a www-client/firefox`

- программа выводит всю доступную информацию о пакете, включая зависимости, `USE-флагии` т. д..

Описание `FEATURES` можно найти в man-странице для `make.conf`:

`$ man make.conf`

или тут:

`https://devmanual.gentoo.org/eclass-reference/make.conf/index.html`

Флаги прописываются в каталог `/etc/portage/make.conf/имя_программы` (указываются нужные флаги - я считаю так удобнее)

Например:

`/etc/portage/make.conf/firefox`

```
www-client/firefox -wayland -wifi -pulseaudio -telemetry -system-png L10N="-be -bg -bs -cs -da -de -el -es-AR -es-CL -es-ES -es-MX -et -fi -fr -hr -hu -it -kk -lt -lv -nl -pl -pt-BR -pt-PT -ro ru -sk -sl -sq -sr -sv uk -ach -af -an -ar -ast -az -be -bg -bn -br -bs -ca -ca-valencia -cak c-s -cy -da -de -dsb -el -en-CA -en-GB -eo -es-AR -es-CL -es-ES -es-MX -et -eu -fa -ff -fi -fr -fy -ga -gd -gl -gn -gu -he -hi -hr -hsb -hu -hy -ia -id -is -it -ja -ka -kab -kk -km -kn -ko -lij -lt -lv -mk -mr -ms -my -nb -ne -nl -nn -oc -pa -pl -pt-BR -pt-PT -rm -ro -sco -si -sk -skr -sl -son -sq -sr -sv -ta -te -th -tl -tr -trs -uk -ur -uz -vi -xh -zh-CN -zh-TW"
```

*Тире перед значением - отключить, без тире - оставить флаг*

`eix firefox` - **найти firefox (приставка bin (firefox-bin), бинарник - флаги не изменяются)**

`emerge -a www-client/firefox` - установить firefox

`emerge -av firefox`— программа выводит всю доступную информацию о пакете, включая USE-флаги, полное имя, размер, категорию и т. д.. 

# В Calculate информация о пакете:

- Красным цветом отмечены активные USE-флаги

- синим — неактивные 

- салатовым — те, которые будут активированы, например, при переустановке или обновлении

- Опция **-v (--verbose)**, увеличивает информативность вывода и показывает флаги, которые будут использоваться для каждого пакета

`emerge -c www-client/firefox - удалит firefox`

---

# Вопрос - Ответ:

- Бинарность лечится раскомментированием `FEATURES="-getbinpkg"` в `/etc/portage/make.conf/custom`

# Решено: 

- Какие флаги поставить в `Calculate linux`?

Это особенность calculate по умолчанию пакеты пишутся без приставки `bin`, но если опция `FEATURES="-getbinpkg"` закоментирована, то сперва ищется бинарный пакет.

Ни чего подобного, просто в оверлее `calculate` прописан `PORTAGE_BINHOST` сервер, на котором хранятся уже заранее собранные пакеты и включего `FEATURES="getbinpkg"`, если данную переменную прописать как `FEATURES="-getbinpkg"`, то перестает использовать данные пакеты и будет собирать из исходников.

