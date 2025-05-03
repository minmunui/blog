---
title: "리눅스를 윈도우에서 쉽게 사용하는 방법 - 가상머신 원격접속하기"
date: 2025-05-01T15:00:00+09:00
categories:
  - blog
tags:
  - 개발
excerpt: 리눅스를 윈도우에서 비교적 쉽게 사용하는 방법.
header:
  teaser: "assets/images/posts/2025-05-02-remote_coding/teaser.png"
  overlay_image: "assets/images/posts/2025-05-02-remote_coding/teaser.png"
  image_description: "CHATGPT로 생성한 윈도위와 리눅스 사진"
  caption: "CHATGPT로 생성한 윈도위와 리눅스 사진"
  overlay_filter: 0.5
toc: true
toc_sticky: true
---

## 리눅스를 윈도우에서 쉽게 사용하는 방법 - 가상머신 원격접속하기

### 개요

개발을 하다 보면 리눅스를 반드시 사용해야 할 때가 있다. 사용하려는 프로젝트가 리눅스에서만 작동한다거나, 리눅스에서 작동하는 프로그램을 만들어야 한다거나, 서버환경과 비슷한 환경을 원한다거나, 아니면 과제를 해야
한다거나… 이러한 경우에 리눅스 컴퓨터가 없다면, 가상머신을 사용하게 된다.

하지만, Virtual Box와 같은 도구를 사용하여 가상머신을 사용할 경우, 해당 가상머신 안에서 작업하는 것은 번거로움이 많다. 윈도우와 클립보드가 공유되지 않으며, 윈도우와 파일 이동도 자유롭지 않고, IDE를
새로 구축해야 한다.

게다가 가상머신이 GUI를 지원하지 않는다면 터미널을 이용해서 작업해야 한다. 리눅스 터미널을 사용하는 것에 능숙하다면 문제없지만, 터미널 사용이 익숙하지 않다면 작업속도가 크게 떨어지게 된다. 하지만 원격접속을
사용한다면, 내가 평소에 사용하던 IDE, Windows장치를 통해서도 리눅스 가상머신에 접근하여 작업할 수 있다.

이 포스트에서는 Virtual Machine에서 작동중인 가상환경에 ssh 원격접속을 하는 방법을 소개한다.

### 목표

가상환경에 원격접속을 하기 위해서는 아래와 같은 설정을 거쳐야 한다.

- Virtual Box에서 Bridged Adapter 설정
- 가상머신에서 ssh 서버 설치 및 설정
- 가상머신의 IP 확인
- Windows에서 ssh로 연결

### Bridged Adaptor 설정

Virtual Box에서 별도의 설정을 하지 않았다면, 가상머신은 NAT를 기본으로 네트워크에 연결되어 있다. NAT설정의 경우 호스트 머신( Virtual Box를 실행중인 장치 )에서 별도의 사설망을 만들어
가상머신이 인터넷에 연결할 수 있도록 한다. 이와 경우 외부에서 가상머신에 접근하는 것이 어렵다. 외부에서 가상머신을 별도의 네트워크 사용자로 인식하고 통신하기 위해서는 호스트머신의 사설망 밖으로 가상머신을
노출시켜야 한다. Virtual Box 설정에서 이를 수행할 수 있다.

<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/adaptor-bridge.svg" alt="Bridged Adaptor 설정 모식도"/>

Oracle Virtual Box를 실행하고, 가상머신을 선택한 후`[설정]-[네트워크]-[어댑터 1]-[다음에 연결됨]`을`[어댑터의 브릿지]`로 설정한다. 이를 통해서 마치 가상머신이 물리적인 네트워크에 연결된
것처럼 사용할 수 있다. 만약 호스트머신(사용중인 Windows PC)이 공유기를 통해서 인터넷에 연결되어 있다면, 가상머신도 공유기를 통해서 인터넷에 연결된다.

### 가상머신에서 SSH서버 설치 및 설정

<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/ssh-open.svg" alt="ssh 서버 실행 모식도"/>

ssh는 Secure Shell의 약자로, 원격으로 컴퓨터에 접속할 수 있는 프로토콜이다. ssh를 사용하면, 원격으로 컴퓨터에 접속하여 명령어를 입력하고, 파일을 조회하거나 수정할 수 있으며 이를 이용하여
가상머신에서 코드를 작성 및 실행할 수 있다. 그러기 위해서는 ssh 서버를 오픈하여 ssh프로토콜로 명령을 받을 수 있도록 준비해야 한다.

ssh가 이미 설치되어 있는지 확인하기 위하여 아래의 명령어를 입력한 후 출력을 확인한다.

```bash
sudo systemctl status ssh
```

#### ssh가 설치되어 있지 않은 경우

ssh 서버를 설치하기 위해서 아래의 명령어를 입력한다. 패키지 정보가 최신이 아닐 경우를 대비하여 프로그램 목록을 업데이트해야 한다.

```bash
sudo apt update
```

```bash
sudo apt install openssh-server
```

#### ssh가 꺼져있는 경우

아래 명령어를 입력하여 ssh를 실행한다.

```bash
sudo systemctl start ssh
```

### 가상머신의 IP확인

가상머신이 외부 네트워크에 노출되었다면, 다른 장치에서 가상머신에 접근하기 위해서 가상머신의 IP주소를 알아야 한다. 가상머신을 실행하고 터미널을 열어 아래의 명령어를 입력하면, 가상머신에서 사용중인 네트워크
인터페이스에 대한 정보를 확인할 수 있다.

```bash
ip addr
```

위 명령어를 입력할 경우 여러개의 네트워크 인터페이스가 나올 것이다. 'inet'이후에 나오는 IP주소가 가상머신의 IP주소이다. 그러나 loopback 인터페이스인`lo`의 IP주소는 제외하고, 실제로 사용되는
네트워크 인터페이스의 IP주소를 확인해야 한다.(127.0.0.1이 아니라는 것이다.)일반적으로 공유기를 사용할 경우`enp0s3`또는`enp0s8`와 같은 이름을 가진 인터페이스가 사용되며, 그 IP주소는
`192.168.x.x`와 같은 형태를 가진다.

### **Windows에서 ssh로 연결하기**

<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/connect-ssh.svg" alt="connect-ssh 모식도"/>

#### **PowerShell을 이용한 방법**

가장 간단한 방법은 Windows PowerShell을 사용하는 것이다. Windows PowerShell을 실행하고, 아래의 명령어를 입력한다.`<username>`은 가상머신의 사용자 이름,
`<ip_address>`는 가상머신의 IP 주소를 입력한다.

윈도우 Powershell에서 아래 명령어를 입력한다.

```bash
ssh <username>@<ip_address>
```

가상머신에 접속하게 될 경우 터미널을 이용해 가상머신의 파일에 접근하고, 명령어를 입력할 수 있다.

<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/cli-ssh-success.png" alt="cli를 통한 연결 성공"/>

#### **VS Code를 이용한 방법**

그러나 PowerShell을 이용한 CLI환경을 불편하며, GUI없이 vim으로 프로그램을 작성하는 것은 쉽지 않다. 이를 해결하기 위해 우리가 일반적으로 사용하는 IDE를 사용하여 가상머신에서 프로그램을 작성하고
실행할 수 있다.

가장 많이 사용하는 VS Code를 이용하여 가상머신에 접속하는 방법을 알아보자.

VS Code를 실행하고, 좌측의 확장 프로그램을 선택한 후,`Remote - SSH`를 검색하여 설치한다.

<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/install-remote-ssh.png" alt="remote-ssh 설치"/>

설치가 완료되면, 좌측 하단의`Open Remote Window (파란색 꺽쇠괄호 아이콘)`를 선택한 후,`Remote-SSH: Connect to Host`를 선택한다.

<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/run-ssh.png" alt="remote-ssh 설치"/>


그 후,`Add New SSH Host`를 선택하고, 아래의 명령어를 입력한다.

---
<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/vscode-add-new-remote.png" alt="remote-ssh 실행"/>
<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/vscode-ssh-command.png" alt="remote-ssh 실행"/>

---

```bash
ssh <username>@<ip_address>
```

`<username>`은 가상머신의 사용자 이름,`<ip_address>`는 가상머신의 IP 주소를 입력한다. 그 후,`Enter`를 누르면, 새로운 창이 열리며 가상머신에서 접속할 수 있다. 이후 VS Code를
이용하여 파일을 만들고 수정, 터미널 명령 입력을 할 수 있다.

#### **Jetbrains IDE**

Jetbrains IDE를 사용하는 경우, 아래의 방법으로 가상머신에 접속할 수 있다.



일반적인 Jetbrains IDE에서`[File]`-`[Remote Development]`를 선택한 후 SSH를 선택하여 IP와 Port, Username을 입력하면 SSH를 통해 원격 컴퓨터로 접속할 수 있다.
이러한 방법으로 Jetbrains IDE를 사용하면서도 가상머신에 접속하여 작업할 수 있다.

<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/jet-new.png" alt="Jetbrains에서 remote-ssh 실행"/>


<img src="{{ site.baseurl }}/assets/images/posts/2025-05-02-remote_coding/jet-form.png" alt="Jetbrains에서 remote-ssh 실행"/>

### **마치며**

이러한 방법으로 컴퓨터 내의 Virtual Box가상머신 뿐만 아니라, WSL, Docker 등 다양한 가상화 환경을 원격으로 접속할 수 있다.

외에도 외부 서버에 접속하여 작업하거나, 아마존 AWS, 구글 클라우드 플랫폼(GCP)등 다양한 클라우드 환경에서도 윈도우 GUI를 사용하여 작업할 수 있다.

해당 서버의 IP를 확인하고, ssh로 접속하여 작업하면 된다.