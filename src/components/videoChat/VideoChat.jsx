import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react';


const VideoChatWithHooks = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const socketRef = useRef();
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);

  useEffect(() => {
    socketRef.current = io.connect('/');

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setupPeerConnection(stream);
      } catch (error) {
        console.error('Failed to get media devices:', error);
      }
    };

    initializeMedia();

    socketRef.current.on('receiveCandidate', candidate => {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => socketRef.current.disconnect();
  }, []);
  const toggleScreenShare = async () => {
  if (!peerConnection.current) return;

  // If already sharing → switch back to camera
  if (isScreenSharing) {
    const videoTrack = localStream.getVideoTracks()[0];
    const sender = peerConnection.current
      .getSenders()
      .find(s => s.track.kind === 'video');

    sender.replaceTrack(videoTrack);
    localVideoRef.current.srcObject = localStream;

    screenStreamRef.current.getTracks().forEach(track => track.stop());
    setIsScreenSharing(false);
    return;
  }

  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    const sender = peerConnection.current
      .getSenders()
      .find(s => s.track.kind === 'video');

    sender.replaceTrack(screenTrack);
    localVideoRef.current.srcObject = screenStream;
    screenStreamRef.current = screenStream;
    setIsScreenSharing(true);

    // Auto switch back when user stops sharing
    screenTrack.onended = () => {
      toggleScreenShare();
    };
  } catch (err) {
    console.error('Screen share failed:', err);
  }
};

  const setupPeerConnection = (stream) => {
    peerConnection.current = new RTCPeerConnection();
    stream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('sendCandidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicEnabled(!isMicEnabled);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraEnabled(!isCameraEnabled);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Remote video - full screen background */}
      <video
        ref={remoteVideoRef}
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Local video - picture-in-picture style */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className="absolute top-4 right-4 w-48 h-36 object-cover border-2 border-white rounded-lg shadow-lg"
      />

      {/* Control buttons overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          
        <button
  onClick={toggleScreenShare}
  className={`p-4 rounded-full ${
    isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-800'
  } text-white transition-colors shadow-lg`}
  title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
>
  <Monitor size={24} />
</button>

        <button
          onClick={toggleMic}
          className={`p-4 rounded-full ${isMicEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors shadow-lg`}
          title={isMicEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button
          onClick={toggleCamera}
          className={`p-4 rounded-full ${isCameraEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors shadow-lg`}
          title={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isCameraEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>
      </div>
    </div>
  );
};

export default VideoChatWithHooks;