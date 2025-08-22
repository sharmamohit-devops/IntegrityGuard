// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.querySelector('i').classList.toggle('fa-bars');
    hamburger.querySelector('i').classList.toggle('fa-times');
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth',
            });
        }

        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        }
    });
});

// Scan media functionality with loader
const img = document.querySelector('.video-placeholder img');
const video = document.querySelector('.video-placeholder video');
const scanningOverlay = document.querySelector('.scanning-overlay');
const scanningMessage = document.getElementById('scanningMessage');
const identityStatus = document.getElementById('identityStatus');
const logItems = document.querySelector('.log-items');
const trustScore = document.querySelector('.score-value');

// Simulate incident functionality
document.getElementById('simulateEvent').addEventListener('click', function () {
    const incidents = [
        { icon: 'fa-eye', text: 'Candidate looking away from screen frequently', type: 'warning' },
        { icon: 'fa-user-times', text: 'Possible impersonation detected', type: 'danger' },
        { icon: 'fa-keyboard', text: 'Unauthorized keyboard activity detected', type: 'warning' },
        { icon: 'fa-mobile-alt', text: 'Second device usage suspected', type: 'danger' }
    ];

    const randomIncident = incidents[Math.floor(Math.random() * incidents.length)];

    const newLogItem = document.createElement('div');
    newLogItem.className = `log-item ${randomIncident.type}`;
    newLogItem.innerHTML = `
                <i class="fas ${randomIncident.icon} log-icon"></i>
                <div class="log-details">
                    <p>${randomIncident.text}</p>
                    <small>Just now</small>
                </div>
            `;
    newLogItem.style.opacity = 0;
    newLogItem.style.transform = 'translateY(20px)';
    newLogItem.style.transition = 'all 0.5s ease';

    logItems.insertBefore(newLogItem, logItems.firstChild);

    setTimeout(() => {
        newLogItem.style.opacity = 1;
        newLogItem.style.transform = 'translateY(0)';
    }, 100);

    const currentScore = parseInt(trustScore.textContent);
    const newScore = Math.max(50, currentScore - Math.floor(Math.random() * 15));
    trustScore.textContent = `${newScore}%`;

    trustScore.style.transition = 'color 0.5s ease';
    if (newScore < 70) {
        trustScore.style.color = 'var(--warning)';
    }
    if (newScore < 60) {
        trustScore.style.color = 'var(--danger)';
    } else {
        trustScore.style.color = 'var(--success)';
    }

    showNotification(`Simulated Incident: ${randomIncident.text}`, 'var(--highlight)');
});

// Scan media functionality with loader
document.getElementById('scanMedia').addEventListener('click', function () {
    let imageResult = null;
    let videoResult = null;

    // Function to show notification
    function showNotification(message, bgColor) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.background = bgColor;
        notification.style.color = 'var(--white)';
        notification.style.padding = '1rem';
        notification.style.borderRadius = '0.5rem';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.5s ease';
        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Function to add log item
    function addLogItem(message, methods, type, icon) {
        const logItem = document.createElement('div');
        logItem.className = `log-item ${type}`;
        logItem.innerHTML = `
                    <i class="fas ${icon} log-icon"></i>
                    <div class="log-details">
                        <p><strong>Scan Response:</strong> ${message}</p>
                        ${methods.map(method => `<p>- ${method}</p>`).join('')}
                        <small>Just now</small>
                    </div>
                `;
        logItem.style.opacity = 0;
        logItem.style.transform = 'translateY(20px)';
        logItem.style.transition = 'all 0.5s ease';

        logItems.insertBefore(logItem, logItems.firstChild);

        setTimeout(() => {
            logItem.style.opacity = 1;
            logItem.style.transform = 'translateY(0)';
        }, 100);
    }

    // Function to scan media (image or video)
    function scanMedia(type, isVideo) {
        return new Promise(resolve => {
            scanningOverlay.classList.add('active');
            scanningMessage.textContent = `Scanning ${type} for Face Verification...`;
            identityStatus.textContent = `Verifying ${type} Identity...`;
            if (isVideo) {
                img.classList.remove('active');
                video.classList.add('active');
                video.play();
            } else {
                video.classList.remove('active');
                img.classList.add('active');
            }

            setTimeout(() => {
                scanningOverlay.classList.remove('active');
                if (isVideo) video.pause();

                const isCheating = Math.random() > 0.5;
                const result = {
                    type: isCheating ? 'danger' : 'success',
                    icon: isCheating ? 'fa-exclamation-triangle' : 'fa-check-circle',
                    message: isCheating ? `${type} face verification failed.` : `${type} face verified successfully.`,
                    methods: isCheating ? [
                        'Multiple faces detected (possible collaboration)',
                        'Inconsistent facial features detected',
                        'Liveness detection failed (possible spoofing)'
                    ].slice(0, Math.floor(Math.random() * 3) + 1) : []
                };

                identityStatus.textContent = isCheating ? 'Identity Verification Failed' : 'Identity Verified';
                addLogItem(result.message, result.methods, result.type, result.icon);
                showNotification(`<strong>${type} Scan Complete:</strong> ${result.message}<br>${result.methods.join('<br>')}`, isCheating ? 'var(--danger)' : 'var(--success)');

                resolve({ isCheating, methods: result.methods });
            }, 3000);
        });
    }

    // Perform scans sequentially
    async function performScans() {
        imageResult = await scanMedia('Image', false);
        videoResult = await scanMedia('Video', true);

        // Combine results
        const isCheating = imageResult.isCheating || videoResult.isCheating;
        const combinedMethods = [
            ...(imageResult.isCheating ? imageResult.methods.map(m => `Image: ${m}`) : []),
            ...(videoResult.isCheating ? videoResult.methods.map(m => `Video: ${m}`) : [])
        ];

        const finalMessage = isCheating ? 'Face verification failed in media.' : 'Face verification successful in media.';
        const finalType = isCheating ? 'danger' : 'success';
        const finalIcon = isCheating ? 'fa-exclamation-triangle' : 'fa-check-circle';

        trustScore.textContent = isCheating ? '58%' : '98%';
        trustScore.style.color = isCheating ? 'var(--danger)' : 'var(--success)';

        addLogItem(finalMessage, combinedMethods, finalType, finalIcon);
        showNotification(`<strong>Final Scan Complete:</strong> ${finalMessage}<br>${combinedMethods.join('<br>')}`, isCheating ? 'var(--danger)' : 'var(--success)');

        // Reset display to image
        video.classList.remove('active');
        img.classList.add('active');
        identityStatus.textContent = 'Identity Verification in Progress';
    }

    performScans();
});

// Live interview functionality
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendMessage = document.getElementById('sendMessage');
const interviewNotes = document.getElementById('interviewNotes');
const saveNotes = document.getElementById('saveNotes');
const startCall = document.getElementById('startCall');
const endCall = document.getElementById('endCall');
const candidateVideo = document.getElementById('candidateVideo');
const hrVideo = document.getElementById('hrVideo');
const toggleCandidateVideo = document.getElementById('toggleCandidateVideo');
const toggleCandidateAudio = document.getElementById('toggleCandidateAudio');
const toggleHRVideo = document.getElementById('toggleHRVideo');
const toggleHRAudio = document.getElementById('toggleHRAudio');

// WebRTC setup
let localStream = null;
let remoteStream = null;
let peerConnection = null;
const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Simulate signaling server (for demo purposes)
const signalingServer = {
    send: (message) => {
        console.log('Signaling:', message);
        setTimeout(() => signalingServer.onmessage(message), 1000);
    },
    onmessage: (message) => {
        if (message.offer) {
            handleOffer(message.offer);
        } else if (message.answer) {
            handleAnswer(message.answer);
        } else if (message.candidate) {
            handleCandidate(message.candidate);
        }
    }
};

async function startVideoCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        hrVideo.srcObject = localStream;
        remoteStream = new MediaStream();
        candidateVideo.srcObject = remoteStream;

        peerConnection = new RTCPeerConnection(configuration);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            });
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                signalingServer.send({ candidate: event.candidate });
            }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        signalingServer.send({ offer });

        showNotification('Video call started!', 'var(--success)');
        startCall.disabled = true;
        endCall.disabled = false;
        toggleHRVideo.disabled = false;
        toggleHRAudio.disabled = false;
    } catch (error) {
        console.error('Error starting video call:', error);
        showNotification('Failed to start video call. Please check permissions.', 'var(--danger)');
    }
}

async function handleOffer(offer) {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        signalingServer.send({ answer });
    } catch (error) {
        console.error('Error handling offer:', error);
    }
}

async function handleAnswer(answer) {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
        console.error('Error handling answer:', error);
    }
}

async function handleCandidate(candidate) {
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
        console.error('Error handling candidate:', error);
    }
}

function endVideoCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }
    hrVideo.srcObject = null;
    candidateVideo.srcObject = null;
    startCall.disabled = false;
    endCall.disabled = true;
    toggleHRVideo.disabled = true;
    toggleHRAudio.disabled = true;
    toggleHRVideo.querySelector('i').classList.remove('fa-video-slash');
    toggleHRVideo.querySelector('i').classList.add('fa-video');
    toggleHRAudio.querySelector('i').classList.remove('fa-microphone-slash');
    toggleHRAudio.querySelector('i').classList.add('fa-microphone');
    showNotification('Video call ended.', 'var(--warning)');
}

// Video and audio toggle controls
toggleHRVideo.addEventListener('click', () => {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        toggleHRVideo.querySelector('i').classList.toggle('fa-video');
        toggleHRVideo.querySelector('i').classList.toggle('fa-video-slash');
        showNotification(`HR video ${videoTrack.enabled ? 'enabled' : 'disabled'}.`, 'var(--success)');
    }
});

toggleHRAudio.addEventListener('click', () => {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        toggleHRAudio.querySelector('i').classList.toggle('fa-microphone');
        toggleHRAudio.querySelector('i').classList.toggle('fa-microphone-slash');
        showNotification(`HR audio ${audioTrack.enabled ? 'enabled' : 'disabled'}.`, 'var(--success)');
    }
});

toggleCandidateVideo.addEventListener('click', () => {
    showNotification('Candidate video toggled (simulated).', 'var(--success)');
});

toggleCandidateAudio.addEventListener('click', () => {
    showNotification('Candidate audio toggled (simulated).', 'var(--success)');
});

startCall.addEventListener('click', startVideoCall);
endCall.addEventListener('click', endVideoCall);

// Simulate secure chat
sendMessage.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        const newMessage = document.createElement('div');
        newMessage.className = 'chat-message hr';
        newMessage.innerHTML = `
                    <p><strong>HR:</strong> ${message}</p>
                    <small>Just now</small>
                `;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatInput.value = '';

        setTimeout(() => {
            const candidateMessage = document.createElement('div');
            candidateMessage.className = 'chat-message';
            candidateMessage.innerHTML = `
                        <p><strong>Candidate:</strong> Thank you for your question! Here's my response...</p>
                        <small>Just now</small>
                    `;
            chatMessages.appendChild(candidateMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
});

// Save notes functionality
saveNotes.addEventListener('click', () => {
    const notes = interviewNotes.value.trim();
    if (notes) {
        showNotification('Notes saved successfully!', 'var(--success)');
        console.log('Saved Notes:', notes);
        interviewNotes.value = '';
    } else {
        showNotification('Please enter notes to save.', 'var(--warning)');
    }
});

// Notification function for chat, notes, and video call
function showNotification(message, bgColor) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = bgColor;
    notification.style.color = 'var(--white)';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '0.5rem';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.5s ease';
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}