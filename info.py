from pydub.utils import mediainfo
import wave
import subprocess
import json

def get_audio_properties(file_path):
    # Using pydub to get basic audio properties
    info = mediainfo(file_path)
    sample_rate = int(info['sample_rate'])
    channels = int(info['channels'])
    duration = float(info['duration'])

    # Using wave library to get more properties
    with wave.open(file_path, 'rb') as wf:
        sample_width = wf.getsampwidth()
        frame_rate = wf.getframerate()
        frames = wf.getnframes()
        wf.close()
    
    # Run ffprobe command to extract metadata
    ffprobe_command = ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', file_path]
    result = subprocess.run(ffprobe_command, capture_output=True, text=True)

    # Parse JSON output
    metadata = json.loads(result.stdout)

    # Print all properties
    for key, value in metadata.items():
        print(f"{key}: {value}")

    print("Sample Rate:", sample_rate)
    print("Channels:", channels)
    print("Sample Width:", sample_width)
    print("Frame Rate:", frame_rate)
    print("Frames:", frames)
    print("Duration (seconds):", duration)

# get_audio_properties("O:\\Projects\\ML\\Depression Screening\\speech_model\\03-01-01-01-01-01-01.wav")
print("\n\n")
get_audio_properties("O:\\Projects\\ML\\Depression Screening\\my_recording.wav")
