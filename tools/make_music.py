"""
Generates the placeholder background track: a soft instrumental loop in a
Bhoopali-style pentatonic scale (C D E G A), with plucked notes over a quiet drone.

Output: assets/music/wedding-theme.wav (mono, 22.05 kHz, 16-bit, about 44 seconds, loops seamlessly).
This is original, generated audio with no copyright. Replace it with your own song any time
(update the path in content.js).

Usage:  python tools/make_music.py
Needs only the Python standard library.
"""
import math
import os
import struct
import wave

RATE = 22050
BPM = 66
BEAT = 60.0 / BPM
ROOT_HZ = 261.63  # C4

# Scale degrees in semitones for C D E G A (Bhoopali pentatonic).
SCALE = [0, 2, 4, 7, 9]

# (scale degree, octave shift, beats). Six 8-beat phrases make a 48-beat loop.
PHRASE_A = [(2, 0, 1), (1, 0, 1), (0, 0, 2), (3, 0, 1), (4, 0, 1), (3, 0, 2)]
PHRASE_B = [(4, 0, 1), (3, 0, 1), (2, 0, 1), (1, 0, 1), (2, 0, 2), (0, 1, 2)]
PHRASE_C = [(0, 1, 1), (4, 0, 1), (3, 0, 1), (2, 0, 1), (3, 0, 2), (2, 0, 2)]
PHRASE_D = [(1, 0, 1), (2, 0, 1), (3, 0, 1), (4, 0, 1), (3, 0, 2), (0, 0, 2)]
MELODY = PHRASE_A + PHRASE_B + PHRASE_C + PHRASE_D + PHRASE_A + PHRASE_B

TOTAL_BEATS = sum(b for _, _, b in MELODY)
LOOP_SECONDS = TOTAL_BEATS * BEAT
N = int(round(LOOP_SECONDS * RATE))


def note_hz(degree, octave_shift):
    semis = SCALE[degree] + 12 * octave_shift
    return ROOT_HZ * (2.0 ** (semis / 12.0))


def main():
    buf = [0.0] * N

    # Plucked string: a sine with a soft overtone that decays quickly.
    t_cursor = 0.0
    for degree, octave, beats in MELODY:
        hz = note_hz(degree, octave)
        start = int(t_cursor * RATE)
        dur = beats * BEAT * 1.6  # let notes ring a little into the next
        length = int(dur * RATE)
        for n in range(length):
            t = n / RATE
            env = min(1.0, t / 0.008) * math.exp(-t * 4.2)
            val = (math.sin(2 * math.pi * hz * t) + 0.25 * math.sin(2 * math.pi * 2 * hz * t)) * env
            # Wrap around the end so the loop stays seamless.
            buf[(start + n) % N] += 0.34 * val
        t_cursor += beats * BEAT

    # Quiet drone on C3 and G3, with a slow swell that repeats exactly once per loop.
    for n in range(N):
        t = n / RATE
        swell = 0.6 + 0.4 * math.sin(2 * math.pi * n / N)
        drone = math.sin(2 * math.pi * 130.81 * t) * 0.07 + math.sin(2 * math.pi * 196.0 * t) * 0.05
        buf[n] += drone * swell

    peak = max(1e-9, max(abs(v) for v in buf))
    scale = 0.85 / peak

    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "music")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "wedding-theme.wav")

    with wave.open(out_path, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        frames = bytearray()
        for v in buf:
            frames += struct.pack("<h", int(max(-1.0, min(1.0, v * scale)) * 32767))
        wav.writeframes(bytes(frames))

    print("Wrote", os.path.normpath(out_path), "%.1f seconds" % LOOP_SECONDS)


if __name__ == "__main__":
    main()
