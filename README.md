# bitTrader2

콜백 지옥인 bitTrader 코드를 수정하기 보단 새로 만드는 것이 쉬울 것 같아 새로 코드, 기능을 정리하면서 새로 만들어보았다.
</br>
</br>

## 개발 환경
1. 서비스 실행에 필요한 환경
```
Python 3.7.6
Flask 1.1.2
pyupbit 0.2.19
joblib 1.0.1
scikit-learn 0.24.1
```
2. 모델(model.ipynb) 생성에 필요한 환경
```
pandas 1.2.3
joblib 1.0.1
lightgbm 3.1.1
scikit-learn 0.24.1
```
</br>
</br>

## Anaconda3 설치 및 설정
```
<!-- 원하는 버전 파일 확인 -->
https://repo.anaconda.com/archive/

<!-- 파일 다운로드 -->
$ sudo wget https://repo.anaconda.com/archive/<파일명>
ex) sudo wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh

<!-- conda 설치 -->
$ bash <파일명>
ex) bash Anaconda3-2020.11-Linux-x86_64.sh

<!-- PATH 설정 -->
$ vim ~/.bashrc 
파일 아래에 
export PATH = /home/<userid>/anaconda3/bin:$PATH 추가
ex) export PATH = /home/ubuntu/anaconda3/bin:$PATH

<!-- 설정 적용 -->
$ source ~/.bashrc

<!-- conda 가상환경 사용할 수 있게 설정 -->
$ source ~/anaconda3/etc/profile.d/conda.sh
```
</br>
</br>

## conda 가상환경 생성
```
<!-- 원하는 python 버전 찾는다 -->
$ conda search python

<!-- 생성 -->
$ conda create -n <가상환경이름> python=<python 버전>
ex) conda create -n bitTrader python=3.7.6

<!-- 실행 -->
$ conda activate <가상환경이름>
ex) conda activate bitTrader
```
</br>
</br>

## 패키지 설치
```
conda install flask
conda install joblib
conda install scikit-learn
pip install pyupbit
conda install pyjwt
```
</br>
</br>

## github repository clone
```
$ git clone https://github.com/ok0749/bitTrader2.git
```
</br>
</br>

## 서비스 실행
```
$ python main.py
```
</br>
</br>

### 모델 생성 방법(새로 생성해 보고 싶은 경우)
```
1. data 디렉토리 생성 ($ mkdir ./data)
2. data 디렉토리 안에 데이터 다운로드 (https://dacon.io/competitions/official/235740/data)
3. model.ipynb 파일에서 Run All
```