![](/gentoo/fastfetch.png)

```bash
sudo su -
passwd root     # root
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
Нажмите на клавишу `p `для отображения текущей конфигурации разделов

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

EFI system partition (/dev/sda1) должен быть отформатирован как FAT32:

```bash
mkfs.vfat -F 32 /dev/sda1
mkswap /dev/sda2
mkfs.ext4 /dev/sda3
```

### Монтирование

```bash
mkdir -p /mnt/gentoo
mount /dev/sda3 /mnt/gentoo
swapon /dev/sda2
```

### Скачивание архива stage

Перейти в каталог установки и скачать:

```bash
cd /mnt/gentoo
wget <PASTED_STAGE_FILE_URL>
```
После скачивания и проверки файл stage необходимо распаковать с помощью `tar`:

`tar xpvf stage3-*.tar.xz --xattrs-include='*.*' --numeric-owner`

### Настройка компиляции 

`nano /mnt/gentoo/etc/portage/make.conf`

```bash
COMMON_FLAGS="-O2 -pipe"
CFLAGS="${COMMON_FLAGS}"
CXXFLAGS="${COMMON_FLAGS}"
FCFLAGS="${COMMON_FLAGS}"
FFLAGS="${COMMON_FLAGS}"
MAKEOPTS="-j5"
ACCEPT_LICENSE="*"
VIDEO_CARDS="intel"
USE="X wayland dbus elogind networkmanager alsa udev -doc -examples -test -telemetry"
GENTOO_MIRRORS="http://mirror.yandex.ru/gentoo-distfiles/"
```
### Переход в изолированную среду

Копирование информации о DNS

`cp --dereference /etc/resolv.conf /mnt/gentoo/etc/`

```bash
mount --types proc /proc /mnt/gentoo/proc
mount --rbind /sys /mnt/gentoo/sys
mount --make-rslave /mnt/gentoo/sys
mount --rbind /dev /mnt/gentoo/dev
mount --make-rslave /mnt/gentoo/dev
mount --bind /run /mnt/gentoo/run
mount --make-slave /mnt/gentoo/run
```
### Предупреждение

Если при установке используется не дистрибутив Gentoo, то этого может быть недостаточно. Некоторые дистрибутивы делают /dev/shm символьной ссылкой на /run/shm/, которая после перехода в изолированную среду станет недействительной. Создание правильного подключения /dev/shm/ в tmpfs поможет избежать этой проблемы:

```bash
test -L /dev/shm && rm /dev/shm && mkdir /dev/shm
mount --types tmpfs --options nosuid,nodev,noexec shm /dev/shm 
```
### Переход в новое окружение

```bash
chroot /mnt/gentoo /bin/bash
source /etc/profile
export PS1="(chroot) ${PS1}"
```
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
### Подготовка к установке начального загрузчика

```bash
mkdir -p /mnt/gentoo /efi
mount /dev/sda1 /efi
```
### Синхронизация Portage

```bash
emerge-webrsync
```
### Выбор профиля 

```Bash
eselect profile list
eselect profile set №
```
### CPU_FLAGS_*

**Пользователям рекомендуется установить эту переменную, по желанию одновременно с настройкой `COMMON_FLAGS`**

Для настройки необходимо выполнить несколько шагов:

`emerge --ask --oneshot app-portage/cpuid2cpuflags`

Если интересно, проверьте вывод вручную:

`cpuid2cpuflags`

Затем скопируйте вывод в package.use:

`echo "*/* $(cpuid2cpuflags)" > /etc/portage/package.use/00cpu-flags`

### Обновить все
 
```Bash
emerge --sync --quiet
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

Команда `eselect locale set <№>` установит необходимую локаль:

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

Теперь, для установки ядра, установим пакет installkernel (не ядро). 

Однако перед установкой, добавим поддержку Dracut.

```bash
# mkdir -p /etc/portage/package.use
nano /etc/portage/package.use/installkernel

sys-kernel/installkernel dracut
sys-kernel/installkernel grub
```
`emerge -av dracut`

### Установим сам пакет.

`emerge --ask sys-kernel/installkernel`

Gentoo предлагает два варианта: 

`gentoo-kernel` и `gentoo-kernel-bin`

Установим бинарный пакет(быстро):

`emerge --ask sys-kernel/gentoo-kernel-bin`

```bash
ls -la /boot/

Должны увидеть что-то вроде:
vmlinuz-6.x.x-gentoo
initramfs-6.x.x-gentoo.img
Если /boot пустой — GRUB не загрузится.
```
---

### Если ядро установлено, но не в `/boot`, найдите его и скопируйте

Найдите файл ядра:

   ```bash
   find /usr/src -name "vmlinuz*" -o -name "bzImage*"
   ```
Скопируйте в `/boot` (замените путь на найденный):

   ```bash
   cp /путь/к/найденному/ядру /boot/vmlinuz-$(uname -r)
   ```
### Если ядро не скопировалось — скопируйте вручную

```bash
cp /usr/src/linux-*/arch/x86/boot/bzImage /boot/vmlinuz-$(uname -r)
dracut -f /boot/initramfs-$(uname -r).img
```
---

Если хотите сами собрать ядро, сконфигурировать его под своё железо и получить опыт сборки ядер, то берите стандартный `gentoo-kernel`:

`emerge --ask sys-kernel/gentoo-kernel`

---

### Создание файла fstab

```bash
nano etc/fstab  # Полный пример /etc/fstab для систем UEFI

/dev/sda1   /efi  vfat  defaults,noatime  0 2
/dev/sda2   none       swap  sw                0 0
/dev/sda3   /          ext4  defaults,noatime  0 1
```

### Host

`echo gentoo > /etc/hostname`

### Сеть

DHCP через dhcpcd (любая система инициализации)

`emerge --ask net-misc/dhcpcd`
`emerge --ask net-misc/netifrc`

Чтобы включить и затем запустить сервис на системах с OpenRC:

```bash
rc-update add dhcpcd default
rc-service dhcpcd start 
```
### Файл hosts

```bash
nano /etc/hosts  

Это обязательные настройки для текущей системы

127.0.0.1     localhost
127.0.0.1      gentoo
```
### Пароль суперпользователя

`passwd`

### GRUB

`echo 'GRUB_PLATFORMS="efi-64"' >> /etc/portage/make.conf`
`emerge --ask --verbose sys-boot/grub efibootmgr neofetch`

Для систем UEFI:
```bash
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=Gentoo

Установка для платформы x86_64-efi.
Установка завершена. Ошибок не обнаружено.
```
Для создания окончательной конфигурации GRUB

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





