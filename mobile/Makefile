SHELL := /bin/bash

.PHONY: setup android start kill devices

# Default AVD name. Override with: make android AVD=Pixel_5
AVD ?= Pixel_9_Pro

setup:
	npm install

# エミュレーターの起動
emu: check-android-home
	android -avd "$(AVD)"

start: check-android-home
	adb start-server

kill: check-android-home
	adb kill-server

devices: check-android-home
	adb devices

