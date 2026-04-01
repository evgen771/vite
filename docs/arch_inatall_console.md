### Установка Arch(в консоли). Проверено. Все работает.

Здесь я не буду писать как записать Arch на флешку.  
Если дело дошло до установки Arch значит как записать образ на флешку это не проблема.  
Если интернет по кабелю - вообще никаких проблем. 

### Загружаетесь с образа и вперед.

![](/arch/arch_wifi.png)

Если wifi то так(изображение прикрепляю, правда снимок сделан не мной, но актуален):

```bash
iwctl
device list
station wlan0 scan
station wlan0 get-networks
station wlan0 connect WIFI_NAME
exit
```
### Разметка

- lsblk
- Если диск /dev/sda(может быть и другой, но идем от этого)
- cfdisk -z /dev/sda(выбрать gpt. Можете другой)

### Создаём разделы

```bash
EFI раздел
Размер:
512M
Тип:
EFI System
Основной раздел - Остальное пространство
Тип:
Linux filesystem
Нажимаем:
Write
Пишем:
yes
Выходим:
Quit
```
### Форматирование разделов - создаём файловые системы

```
EFI
mkfs.fat -F32 /dev/sda1
Основной раздел
mkfs.ext4 /dev/sda2
```
### Монтирование - подключаем разделы

```
mount /dev/sda2 /mnt
EFI:
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
```
### Установка базовой системы

`pacstrap /mnt base linux linux-firmware nano`

### Создание fstab

`genfstab -U /mnt >> /mnt/etc/fstab`

### Переход в установленную систему

`arch-chroot /mnt`

### Настройка времени

```
ln -sf /usr/share/zoneinfo/Asia/Kamchatka /etc/localtime
hwclock --systohc
```
### Локаль

```
nano /etc/locale.gen
Раскомментируйте:
en_US.UTF-8 UTF-8
ru_RU.UTF-8 UTF-8
Сгенерировать:
locale-gen
```

`nano /etc/locale.conf`

Добавить:

`LANG=en_US.UTF-8 / LANG=ru_RU.UTF-8`

### Имя компьютера
```
nano /etc/hostname
arch
```
### Hosts

`nano /etc/hosts`

Добавить(если нет):

```
127.0.0.1 localhost
::1 localhost
127.0.1.1 archpc.localdomain archpc
```
### Пароль root

`passwd`

### Установка загрузчика

`pacman -S grub efibootmgr`

`grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB`

Создать конфиг:

`grub-mkconfig -o /boot/grub/grub.cfg`

### Установка NetworkManager

`pacman -S networkmanager`

Включаем:

`systemctl enable NetworkManager`

### Выходим

`exit`

### Отмонтируем

`umount -R /mnt`

### Перезагрузка

`reboot`

*И вытаскиваем флешку*

### Загрузитесь в чистый Arch

Вход:

`login: root`

### После установки ставя тпользователя

```
useradd -m -G wheel -s /bin/bash user
passwd user
```
sudo:

`pacman -S sudo`

Разрешаем sudo:

`EDITOR=nano visudo`

Раскомментировать:

`%wheel ALL=(ALL:ALL) ALL`







