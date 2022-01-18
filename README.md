# bitTrader2

콜백 지옥인 bitTrader 코드를 수정하기 보단 새로 만드는 것이 쉬울 것 같아 새로 코드, 기능을 정리하면서 새로 만들어보았다.

## 개발 환경
1. 서비스 실행에 필요한 환경
```
Python 3.7.6
Flask 1.1.2
pyupbit 0.2.19
joblib 1.0.1
```
2. 모델(model.ipynb) 생성에 필요한 환경
```
pandas 1.2.3
joblib 1.0.1
lightgbm 3.1.1
scikit-learn 0.24.1
```

## 서비스 실행 방법
```
python main.py
```

### 모델 생성 방법(새로 생성해 보고 싶은 경우)
```
1. data 디렉토리 생성 ($ mkdir ./data)
2. data 디렉토리 안에 데이터 다운로드 (https://dacon.io/competitions/official/235740/data)
3. model.ipynb 파일에서 Run All
```