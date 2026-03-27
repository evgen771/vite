
```bash
sudo su -
passwd root     # root
passwd gentoo   # user
```
### Схема разделов по умолчанию
```bash
/dev/sda1 	/efi 	vfat 	 EFI (ESP)
/dev/sda2 	н/д. 	swap 	 swap 	
/dev/sda3 	/ 	    ext4 	 root
```
### Просмотр текущей разметки разделов. FDISK.
```bash
fdisk -l
fdisk /dev/sda
```
Нажмите на клавишу p для отображения текущей конфигурации разделов

---

### Создание нового disklabel / удаление всех разделов

`g - # чтобы создать новую разметку GPT на диске`

### EFI system partition (ESP)

```bash
n чтобы создать новый раздел, 
1 для выбора первого основного раздела. 
При запросе первого сектора, убедитесь, что он начинается с 2048 (может понадобиться для загрузчика) и нажмите Enter. 
При запросе последнего сектора введите +1G для создания раздела размером 1 Гбайт
Пометьте раздел как системный раздел EFI:
t
Выбранный раздел 1
Тип раздела (нажмите L, чтобы отобразить все): 1
```
### Swap

```bash
n чтобы создать новый раздел, 
2 для создания второго основного раздела, /dev/sda2 
При появлении запроса первого сектора, введите Enter
При появлении запроса последнего сектора, наберите +4G (или любой другой размер, необходимый для подкачки) для создания раздела размером 4 ГиБ. 
t
Номер раздела (1, 2, по умолчанию 2): 2
Тип раздела (наберите L, чтобы отобразить все): 19
Изменен тип раздела с «файловой системы Linux» на «Linux Swap».
```
### Root partition

```bash
n чтобы создать новый раздел. 
3 чтобы создать третий основной раздел, /dev/sda3.
При появлении запроса первого сектора, введите Enter
При запросе последнего сектора нажмите Enter, чтобы создать раздел, занимающий всё оставшееся доступное пространство диска. 
t
Номер раздела (1-3, по умолчанию 3): 3
Тип раздела или псевдоним (наберите L, чтобы отобразить все): 23
Изменен тип раздела «Файловая система Linux» на «Корневой каталог Linux (x86-64)».
```
*После выполнения этих шагов нажмите `p`.  
Должна отображаться таблица разделов*

### Сохранение разметки разделов

Для сохранения разметки разделов и выхода из `fdisk` введите `w`

---

### Создание файловых систем

`mkfs.vfat -F 32 /dev/sda1`
`mkswap /dev/sda2`
`swapon /dev/sda2`
`mkfs.ext4 /dev/sda3`

### Монтирование

`mount /dev/sda3 /mnt/gentoo`
```bash
mkdir /mnt/gentoo/efi
mount /dev/sda1 /mnt/gentoo/efi
```
### Скачивание архива stage

`cd /mnt/gentoo`

wget <PASTED_STAGE_FILE_URL>

После скачивания и проверки файл stage необходимо распаковать с помощью tar :

`tar xpvf stage3-*.tar.xz --xattrs-include='*.*' --numeric-owner`

`emerge-webrsync`

### Настройка компиляции 

`nano /mnt/gentoo/etc/portage/make.conf`

```bash
COMMON_FLAGS="-O2 -pipe -march=x86-64-v3"
CFLAGS="${COMMON_FLAGS}"
CXXFLAGS="${COMMON_FLAGS}"
FCFLAGS="${COMMON_FLAGS}"
FFLAGS="${COMMON_FLAGS}"
MAKEOPTS="-j$(nproc)"
ACCEPT_LICENSE="*"
VIDEO_CARDS="intel"
USE="X wayland dbus elogind networkmanager"
GENTOO_MIRRORS="http://mirror.yandex.ru/gentoo-distfiles/"
```
### Переход в изолированную среду

`cp --dereference /etc/resolv.conf /mnt/gentoo/etc/`

```bash
(очень хитрая) ошибка DNS в chroot:
cp --dereference /etc/resolv.conf /mnt/gentoo/etc/
Но после chroot иногда DNS всё равно не работает.
Проверка:
ping gentoo.org
Если не работает — emerge будет падать.
Исправление:
nano /etc/resolv.conf
Добавить:
nameserver 8.8.8.8
nameserver 1.1.1.1
```
```bash
mount --types proc /proc /mnt/gentoo/proc
mount --rbind /sys /mnt/gentoo/sys
mount --make-rslave /mnt/gentoo/sys
mount --rbind /dev /mnt/gentoo/dev
mount --make-rslave /mnt/gentoo/dev
mount --bind /run /mnt/gentoo/run
mount --make-slave /mnt/gentoo/run
```
Переход в новое окружение
```bash
chroot /mnt/gentoo /bin/bash
source /etc/profile
export PS1="(chroot) ${PS1}"
```

### Синхронизация Portage

```bash
emerge-webrsync
или
emerge --sync
```
### Выбор профиля 

```Bash
eselect profile list
eselect profile set №
emerge --ask --update --deep --newuse @world
```

### Часовой пояс 

```bash
echo "Asia/Kamchatka" > /etc/timezone
emerge --config sys-libs/timezone-data
```

### Настройки локали 

`nano /etc/locale.gen`

```bash
en_US.UTF-8 UTF-8
ru_RU.UTF-8 UTF-8
```
`locale-gen`

*Чтобы убедится, что выбранные локали теперь доступны, запустите команду locale -a*

### Выбор локали 

установить локаль для всей системы, используется `eselect` для этого, только теперь с модулем `locale`.

Команда `eselect locale list` выведет список доступных локалей 

Команда `eselect locale set <NUMBER>` установит необходимую локаль:

`eselect locale set №`

Заново перезагрузите окружение:

`env-update && source /etc/profile && export PS1="(chroot) ${PS1}"`

### Настройка ядра

На многих системах требуется прошивка, не содержащая свободного программного обеспечения:

`emerge --ask sys-kernel/linux-firmware`

Sound Open Firmware (SOF) — это новый аудиодрайвер с открытым исходным кодом:

`emerge --ask sys-firmware/sof-firmware`

обновления микрокода для процессоров Intel:

`emerge --ask --noreplace sys-firmware/intel-microcode`

Теперь, для установки ядра, установим пакет installkernel (не ядро). Однако перед установкой, добавим поддержку Dracut.

```bash
nano /etc/portage/package.use/installkernel
sys-kernel/installkernel dracut
sys-kernel/installkernel grub
```
### Установим сам пакет.

`emerge --ask sys-kernel/installkernel`

Gentoo предлагает два варианта - `gentoo-kernel` и `gentoo-kernel-bin`

Если хотите сами собрать ядро, сконфигурировать его под своё железо и получить опыт сборки ядер, то берите стандартный `gentoo-kernel`

`emerge --ask sys-kernel/gentoo-kernel-bin`
```bash
ls /boot
Ты должен увидеть что-то вроде:
vmlinuz-6.x.x-gentoo
initramfs-6.x.x-gentoo
Если /boot пустой — GRUB не загрузится.
```
### Создание файла fstab

```bash
etc/fstab  # Полный пример /etc/fstab для систем UEFI

/dev/sda1   /boot  vfat  defaults,noatime  0 2
/dev/sda2   none   swap  sw                0 0
/dev/sda3   /      ext4  defaults,noatime  0 1
```

### Host

`echo gentoo > /etc/hostname`

### Сеть

`emerge --ask net-misc/dhcpcd`

Чтобы включить и затем запустить сервис на системах с OpenRC:

```bash
rc-update add dhcpcd default
rc-service dhcpcd start 
```
### Файл hosts

```bash
/etc/hosts  # Внесение сетевой информации

Это обязательные настройки для текущей системы

127.0.0.1     localhost
127.0.1.1      gentoo
```
### Пароль суперпользователя

`passwd`

### GRUB

`emerge --ask --verbose sys-boot/grub`

```bash
grub-install --efi-directory=/efi
Установка для платформы x86_64-efi.
Установка завершена. Ошибок не обнаружено.
```
```bash
grub-mkconfig -o /boot/grub/grub.cfg
Создание файла grub.cfg ...
Найден образ Linux: /boot/vmlinuz-6.18.8-gentoo
Обнаружен образ initrd: /boot/initramfs-genkernel-amd64-6.18.8-gentoo
сделанный
```
### установить чтобы потом не было проблем:
```bash
emerge --ask app-admin/sysklogd
rc-update add sysklogd default
emerge --ask net-misc/networkmanager
```
### Перезагрузка системы

```bash
exit
cd
umount -l /mnt/gentoo/dev{/shm,/pts,}
umount -R /mnt/gentoo
reboot
```





