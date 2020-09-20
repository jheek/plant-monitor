EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L Sensor_Optical:LDR03 R2
U 1 1 5F613E84
P 6150 3150
F 0 "R2" H 6220 3196 50  0000 L CNN
F 1 "LDR" H 6220 3105 50  0000 L CNN
F 2 "OptoDevice:R_LDR_10x8.5mm_P7.6mm_Vertical" V 6325 3150 50  0001 C CNN
F 3 "http://www.elektronica-componenten.nl/WebRoot/StoreNL/Shops/61422969/54F1/BA0C/C664/31B9/2173/C0A8/2AB9/2AEF/LDR03IMP.pdf" H 6150 3100 50  0001 C CNN
	1    6150 3150
	0    -1   -1   0   
$EndComp
$Comp
L Device:R R5
U 1 1 5F614D07
P 8650 4850
F 0 "R5" H 8720 4896 50  0000 L CNN
F 1 "1K" H 8720 4805 50  0000 L CNN
F 2 "" V 8580 4850 50  0001 C CNN
F 3 "~" H 8650 4850 50  0001 C CNN
	1    8650 4850
	0    -1   -1   0   
$EndComp
$Comp
L Device:R R4
U 1 1 5F6155A0
P 8650 4200
F 0 "R4" H 8720 4246 50  0000 L CNN
F 1 "1K" H 8720 4155 50  0000 L CNN
F 2 "" V 8580 4200 50  0001 C CNN
F 3 "~" H 8650 4200 50  0001 C CNN
	1    8650 4200
	0    -1   -1   0   
$EndComp
$Comp
L Device:R R3
U 1 1 5F615A79
P 8650 3550
F 0 "R3" H 8720 3596 50  0000 L CNN
F 1 "1K" H 8720 3505 50  0000 L CNN
F 2 "" V 8580 3550 50  0001 C CNN
F 3 "~" H 8650 3550 50  0001 C CNN
	1    8650 3550
	0    -1   -1   0   
$EndComp
$Comp
L Device:LED D1
U 1 1 5F616EAD
P 9200 3550
F 0 "D1" H 9193 3766 50  0000 C CNN
F 1 "Red LED" H 9193 3675 50  0000 C CNN
F 2 "" H 9200 3550 50  0001 C CNN
F 3 "~" H 9200 3550 50  0001 C CNN
	1    9200 3550
	-1   0    0    1   
$EndComp
$Comp
L Device:LED D2
U 1 1 5F617A91
P 9200 4200
F 0 "D2" H 9193 4416 50  0000 C CNN
F 1 "Green LED" H 9193 4325 50  0000 C CNN
F 2 "" H 9200 4200 50  0001 C CNN
F 3 "~" H 9200 4200 50  0001 C CNN
	1    9200 4200
	-1   0    0    1   
$EndComp
$Comp
L RF_Module:ESP32-WROOM-32 U1
U 1 1 5F662933
P 7550 4150
F 0 "U1" H 7550 5731 50  0000 C CNN
F 1 "ESP32-WROOM-32" H 7550 5640 50  0000 C CNN
F 2 "RF_Module:ESP32-WROOM-32" H 7550 2650 50  0001 C CNN
F 3 "https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf" H 7250 4200 50  0001 C CNN
	1    7550 4150
	1    0    0    -1  
$EndComp
$Comp
L Device:LED D3
U 1 1 5F669700
P 9200 4850
F 0 "D3" H 9193 5066 50  0000 C CNN
F 1 "Blue LED" H 9193 4975 50  0000 C CNN
F 2 "" H 9200 4850 50  0001 C CNN
F 3 "~" H 9200 4850 50  0001 C CNN
	1    9200 4850
	-1   0    0    1   
$EndComp
$Comp
L power:GND #PWR0101
U 1 1 5F66E656
P 7550 5800
F 0 "#PWR0101" H 7550 5550 50  0001 C CNN
F 1 "GND" H 7555 5627 50  0000 C CNN
F 2 "" H 7550 5800 50  0001 C CNN
F 3 "" H 7550 5800 50  0001 C CNN
	1    7550 5800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0102
U 1 1 5F66EDC7
P 6650 4000
F 0 "#PWR0102" H 6650 3750 50  0001 C CNN
F 1 "GND" V 6655 3872 50  0000 R CNN
F 2 "" H 6650 4000 50  0001 C CNN
F 3 "" H 6650 4000 50  0001 C CNN
	1    6650 4000
	1    0    0    -1  
$EndComp
$Comp
L power:+3.3V #PWR0103
U 1 1 5F66F6D6
P 7550 2350
F 0 "#PWR0103" H 7550 2200 50  0001 C CNN
F 1 "+3.3V" H 7565 2523 50  0000 C CNN
F 2 "" H 7550 2350 50  0001 C CNN
F 3 "" H 7550 2350 50  0001 C CNN
	1    7550 2350
	1    0    0    -1  
$EndComp
$Comp
L power:+3.3V #PWR0104
U 1 1 5F66FDE5
P 6550 3750
F 0 "#PWR0104" H 6550 3600 50  0001 C CNN
F 1 "+3.3V" V 6565 3878 50  0000 L CNN
F 2 "" H 6550 3750 50  0001 C CNN
F 3 "" H 6550 3750 50  0001 C CNN
	1    6550 3750
	0    1    1    0   
$EndComp
Wire Wire Line
	7550 2750 7550 2350
Wire Wire Line
	7550 5550 7550 5800
Wire Wire Line
	6650 3850 6650 4000
Wire Wire Line
	6550 3750 6200 3750
Wire Wire Line
	6200 3650 6650 3650
Wire Wire Line
	6650 3650 6650 3250
Wire Wire Line
	6650 3250 6950 3250
$Comp
L Connector:Conn_01x03_Male J1
U 1 1 5F6182A2
P 6000 3750
F 0 "J1" H 6108 4031 50  0000 C CNN
F 1 "Capacitive Moist Sensor" H 6108 3940 50  0000 C CNN
F 2 "" H 6000 3750 50  0001 C CNN
F 3 "~" H 6000 3750 50  0001 C CNN
	1    6000 3750
	1    0    0    -1  
$EndComp
Wire Wire Line
	6200 3850 6650 3850
$Comp
L Device:R R1
U 1 1 5F675B79
P 6500 2850
F 0 "R1" H 6570 2896 50  0000 L CNN
F 1 "10K" H 6570 2805 50  0000 L CNN
F 2 "" V 6430 2850 50  0001 C CNN
F 3 "~" H 6500 2850 50  0001 C CNN
	1    6500 2850
	1    0    0    -1  
$EndComp
Wire Wire Line
	6300 3150 6500 3150
Wire Wire Line
	6500 3000 6500 3150
Connection ~ 6500 3150
Wire Wire Line
	6500 3150 6950 3150
$Comp
L power:GND #PWR0105
U 1 1 5F676EA1
P 6500 2450
F 0 "#PWR0105" H 6500 2200 50  0001 C CNN
F 1 "GND" H 6505 2277 50  0000 C CNN
F 2 "" H 6500 2450 50  0001 C CNN
F 3 "" H 6500 2450 50  0001 C CNN
	1    6500 2450
	-1   0    0    1   
$EndComp
Wire Wire Line
	6500 2700 6500 2450
$Comp
L power:+3.3V #PWR0106
U 1 1 5F677973
P 5750 3150
F 0 "#PWR0106" H 5750 3000 50  0001 C CNN
F 1 "+3.3V" V 5765 3278 50  0000 L CNN
F 2 "" H 5750 3150 50  0001 C CNN
F 3 "" H 5750 3150 50  0001 C CNN
	1    5750 3150
	0    -1   -1   0   
$EndComp
Wire Wire Line
	5750 3150 6000 3150
Wire Wire Line
	8150 3550 8500 3550
Wire Wire Line
	8150 4850 8500 4850
Wire Wire Line
	8150 3750 8350 3750
Wire Wire Line
	8350 3750 8350 4200
Wire Wire Line
	8350 4200 8500 4200
Wire Wire Line
	8800 3550 9050 3550
Wire Wire Line
	8800 4200 9050 4200
Wire Wire Line
	8800 4850 9050 4850
$Comp
L power:GND #PWR0107
U 1 1 5F68B6D8
P 9600 3550
F 0 "#PWR0107" H 9600 3300 50  0001 C CNN
F 1 "GND" V 9605 3422 50  0000 R CNN
F 2 "" H 9600 3550 50  0001 C CNN
F 3 "" H 9600 3550 50  0001 C CNN
	1    9600 3550
	0    -1   -1   0   
$EndComp
$Comp
L power:GND #PWR0108
U 1 1 5F68C6CB
P 9600 4200
F 0 "#PWR0108" H 9600 3950 50  0001 C CNN
F 1 "GND" V 9605 4072 50  0000 R CNN
F 2 "" H 9600 4200 50  0001 C CNN
F 3 "" H 9600 4200 50  0001 C CNN
	1    9600 4200
	0    -1   -1   0   
$EndComp
$Comp
L power:GND #PWR0109
U 1 1 5F68CD31
P 9600 4850
F 0 "#PWR0109" H 9600 4600 50  0001 C CNN
F 1 "GND" V 9605 4722 50  0000 R CNN
F 2 "" H 9600 4850 50  0001 C CNN
F 3 "" H 9600 4850 50  0001 C CNN
	1    9600 4850
	0    -1   -1   0   
$EndComp
Wire Wire Line
	9350 3550 9600 3550
Wire Wire Line
	9350 4200 9600 4200
Wire Wire Line
	9350 4850 9600 4850
$EndSCHEMATC
