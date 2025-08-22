// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.querySelector('i').classList.toggle('fa-bars');
    hamburger.querySelector('i').classList.toggle('fa-times');
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.toggle('fa-bars');
                hamburger.querySelector('i').classList.toggle('fa-times');
            }
        }
    });
});

// Video modal functionality
const demoModal = document.getElementById('demo-modal');
const closeModal = document.querySelector('.close-modal');
const seeDemoBtn = document.getElementById('see-demo-btn');
const demoVideo = document.getElementById('demo-video');

if (seeDemoBtn) {
    seeDemoBtn.addEventListener('click', function (e) {
        e.preventDefault();
        demoVideo.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
        demoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
}

closeModal.addEventListener('click', function () {
    demoModal.style.display = 'none';
    demoVideo.src = '';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function (e) {
    if (e.target === demoModal) {
        demoModal.style.display = 'none';
        demoVideo.src = '';
        document.body.style.overflow = 'auto';
    }
});

// Notification function
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

    const logItems = document.querySelector('.log-items');
    logItems.insertBefore(newLogItem, logItems.firstChild);

    setTimeout(() => {
        newLogItem.style.opacity = 1;
        newLogItem.style.transform = 'translateY(0)';
    }, 100);

    const trustScore = document.querySelector('.score-value');
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
const img = document.querySelector('.video-placeholder img');
const video = document.querySelector('.video-placeholder video');
const scanningOverlay = document.querySelector('.scanning-overlay');
const scanningMessage = document.getElementById('scanningMessage');
const identityStatus = document.getElementById('identityStatus');
const logItems = document.querySelector('.log-items');
const trustScore = document.querySelector('.score-value');

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

document.getElementById('scanMedia').addEventListener('click', function () {
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
                    ].slice(0, Math.floor(Math.random() * 3) + 1) : [
                        'Facial landmarks matched successfully',
                        'Liveness detection confirmed',
                        'Identity verified with high confidence'
                    ]
                };

                identityStatus.textContent = isCheating ? 'Identity Verification Failed' : 'Identity Verified';
                addLogItem(result.message, result.methods, result.type, result.icon);
                showNotification(`<strong>${type} Scan Complete:</strong> ${result.message}<br>${result.methods.join('<br>')}`, isCheating ? 'var(--danger)' : 'var(--success)');

                resolve({ isCheating, methods: result.methods });
            }, 3000);
        });
    }

    async function performScans() {
        const imageResult = await scanMedia('Image', false);
        const videoResult = await scanMedia('Video', true);

        const isCheating = imageResult.isCheating || videoResult.isCheating;
        const combinedMethods = [
            ...(imageResult.isCheating ? imageResult.methods.map(m => `Image: ${m}`) : []),
            ...(videoResult.isCheating ? videoResult.methods.map(m => `Video: ${m}`) : imageResult.methods.map(m => `Video: ${m}`))
        ];

        const finalMessage = isCheating ? 'Face verification failed in media.' : 'Face verification successful in media.';
        const finalType = isCheating ? 'danger' : 'success';
        const finalIcon = isCheating ? 'fa-exclamation-triangle' : 'fa-check-circle';

        trustScore.textContent = isCheating ? '58%' : '98%';
        trustScore.style.color = isCheating ? 'var(--danger)' : 'var(--success)';

        addLogItem(finalMessage, combinedMethods, finalType, finalIcon);
        showNotification(`<strong>Final Scan Complete:</strong> ${finalMessage}<br>${combinedMethods.join('<br>')}`, isCheating ? 'var(--danger)' : 'var(--success)');

        video.classList.remove('active');
        img.classList.add('active');
        identityStatus.textContent = 'Identity Verification in Progress';
    }

    performScans();
});

// Live interview functionality
const startGoogleMeetBtn = document.getElementById('startGoogleMeet');
const shareScreenBtn = document.getElementById('shareScreen');
const endCallBtn = document.getElementById('endCall');
const muteCandidateBtn = document.getElementById('muteCandidate');
const videoOffCandidateBtn = document.getElementById('videoOffCandidate');
const muteHRBtn = document.getElementById('muteHR');
const videoOffHRBtn = document.getElementById('videoOffHR');
const sendMessageBtn = document.getElementById('sendMessage');
const saveNotesBtn = document.getElementById('saveNotes');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const interviewNotes = document.getElementById('interviewNotes');

startGoogleMeetBtn.addEventListener('click', function () {
    // Simulating Google Meet link generation
    const meetLink = 'https://meet.google.com/abc-xyz-123';
    window.open(meetLink, '_blank');
    showNotification('Google Meet session started! Joining now...', 'var(--success)');

    // Simulate AI monitoring activation
    setTimeout(() => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item success';
        logItem.innerHTML = `
                    <i class="fas fa-check-circle log-icon"></i>
                    <div class="log-details">
                        <p>AI monitoring activated for Google Meet session</p>
                        <small>Just now</small>
                    </div>
                `;
        logItems.insertBefore(logItem, logItems.firstChild);
    }, 1000);
});

shareScreenBtn.addEventListener('click', function () {
    showNotification('Screen sharing initiated. Please select your screen in Google Meet.', 'var(--highlight)');
});

endCallBtn.addEventListener('click', function () {
    this.classList.add('disabled');
    showNotification('Interview call ended.', 'var(--danger)');
    setTimeout(() => {
        this.classList.remove('disabled');
    }, 3000);
});

muteCandidateBtn.addEventListener('click', function () {
    const isMuted = this.classList.toggle('disabled');
    showNotification(`Candidate microphone ${isMuted ? 'muted' : 'unmuted'}.`, isMuted ? 'var(--warning)' : 'var(--success)');
});

videoOffCandidateBtn.addEventListener('click', function () {
    const isVideoOff = this.classList.toggle('disabled');
    showNotification(`Candidate video ${isVideoOff ? 'turned off' : 'turned on'}.`, isVideoOff ? 'var(--warning)' : 'var(--success)');
});

muteHRBtn.addEventListener('click', function () {
    const isMuted = this.classList.toggle('disabled');
    showNotification(`HR microphone ${isMuted ? 'muted' : 'unmuted'}.`, isMuted ? 'var(--warning)' : 'var(--success)');
});

videoOffHRBtn.addEventListener('click', function () {
    const isVideoOff = this.classList.toggle('disabled');
    showNotification(`HR video ${isVideoOff ? 'turned off' : 'turned on'}.`, isVideoOff ? 'var(--warning)' : 'var(--success)');
});

sendMessageBtn.addEventListener('click', function () {
    const message = chatInput.value.trim();
    if (message) {
        const newMessage = document.createElement('div');
        newMessage.className = 'chat-message';
        newMessage.innerHTML = `
                    <p>You: ${message}</p>
                    <small>${new Date().toLocaleTimeString()}</small>
                `;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatInput.value = '';
        showNotification('Message sent.', 'var(--success)');
    }
});

saveNotesBtn.addEventListener('click', function () {
    const notes = interviewNotes.value.trim();
    if (notes) {
        showNotification('Interview notes saved successfully.', 'var(--success)');
    } else {
        showNotification('Please enter some notes to save.', 'var(--warning)');
    }
});


// Animation on scroll
const animateElements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.1 });

animateElements.forEach(element => {
    observer.observe(element);
});
