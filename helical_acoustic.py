#!/usr/bin/env python3
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
import os

SR = 44100
DURATION = 270
N = SR * DURATION
t = np.linspace(0, DURATION, N, endpoint=False)
print("Building helical acoustic… SR=%d  N=%d" % (SR, N))

# L1: infrasonic ocean
lfo = 0.5 + 0.5*np.sin(2*np.pi*0.08*t)
c1  = np.sin(2*np.pi*55*t) + 0.4*np.sin(2*np.pi*110*t)
e1  = np.ones(N); e1[:SR*30]=np.linspace(0,1,SR*30); e1[-SR*20:]=np.linspace(1,0,SR*20)
L1  = lfo*c1*e1*0.25
print("L1 ok")

# L2: mangrove 432 Hz harmonics
L2 = sum(a*np.sin(2*np.pi*432*k*t) for k,a in enumerate([1,.55,.3,.18,.10],1))
sos = butter(4,[300/(SR/2),900/(SR/2)],btype='band',output='sos')
L2  = sosfilt(sos,L2)
e2  = np.ones(N); e2[:SR*20]=np.linspace(0,1,SR*20); e2[-SR*30:]=np.linspace(1,0,SR*30)
L2  = L2*e2*(0.85+0.15*np.sin(2*np.pi*6*t))*0.20
print("L2 ok")

# L3: 111 Hz resonance
L3 = np.sin(2*np.pi*111*t)+0.6*np.sin(2*np.pi*111.5*t)+0.3*np.sin(2*np.pi*333*t)
e3 = np.ones(N); e3[:SR*15]=np.linspace(0,1,SR*15); e3[-SR*15:]=np.linspace(1,0,SR*15)
L3 = L3*e3*0.22
print("L3 ok")

# L4: helical sweep r*=0.77594
r_star=0.77594; f_att=111.0; f_in=f_att/3
tnorm=t/DURATION
rt = 1-(1-r_star)*np.exp(-8*tnorm)
fi = np.clip(f_in+(f_att-f_in)*((rt-r_star)/(1-r_star)), f_in, f_att)
ph = 2*np.pi*np.cumsum(fi)/SR
L4 = np.sin(ph)+0.4*np.sin(ph/2)
e4 = np.ones(N); e4[:SR*40]=np.linspace(0,1,SR*40); e4[-SR*10:]=np.linspace(1,0,SR*10)
L4 = L4*e4*rt*0.28
print("L4 ok")

mix = L1+L2+L3+L4
mix = mix/np.max(np.abs(mix))*0.88

wav = "/sessions/exciting-blissful-hamilton/mnt/outputs/helical_acoustic_dm3.wav"
wavfile.write(wav, SR, (mix*32767).astype(np.int16))
print("WAV written: %.1f MB" % (os.path.getsize(wav)/1e6))

mp3 = "/sessions/exciting-blissful-hamilton/mnt/outputs/helical_acoustic_dm3.mp3"
r = os.system('ffmpeg -y -i "%s" -codec:a libmp3lame -qscale:a 2 "%s" -loglevel error' % (wav,mp3))
if r==0 and os.path.exists(mp3):
    print("MP3 written: %.1f MB" % (os.path.getsize(mp3)/1e6))
else:
    print("MP3 skipped")
print("Done 4:30")
