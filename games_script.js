document.querySelectorAll('.game-panel').forEach((panel) => {
    panel.addEventListener('click', () => {
      const type = panel.getAttribute('data-type');
      const name = panel.getAttribute('data-name');
      const developer = panel.getAttribute('data-developer') || 'Unknown Dev';
      const thumbnail = panel.getAttribute('data-thumbnail');
  
      // UI references
      const popup = document.querySelector('.popup-container');
      const lobby = document.getElementById('game-lobby');
      const unavailableMsg = document.getElementById('unavailable-message');
      const iconWrapper = document.getElementById('icon-wrapper');
      const nameSpan = document.getElementById('game-name');
      const devSpan = document.getElementById('game-developer');
      const requirements = document.getElementById('game-requirements');
      const gamePanel = document.getElementById('game-panel');
      const playerCountText = document.getElementById('player-count-text');
      const winningsText = document.getElementById('winnings-text');
      const loginWarning = document.getElementById('login-warning');
      const topupWarning = document.getElementById('topup-warning');
      const warningWrapper = document.getElementById('game-warning-text-wrapper');
  
      // Reset warnings
      loginWarning.style.display = 'none';
      topupWarning.style.display = 'none';
      warningWrapper.style.display = 'none';
  
      // Show popup
      popup.style.display = 'flex';
      lobby.style.display = 'flex';
  
      if (type === 'unavailable') {
        unavailableMsg.style.display = 'block';
        gamePanel.style.display = 'none';
        requirements.style.display = 'none';
        return;
      }
  
      unavailableMsg.style.display = 'none';
      gamePanel.style.display = 'flex';
      requirements.style.display = '';
  
      iconWrapper.innerHTML = `<img src="${thumbnail}" alt="${name} thumbnail" style="width: 100px; height: auto;">`;
      nameSpan.textContent = name;
      devSpan.textContent = developer;
  
      const entryFees = [200, 500, 1000, 5000];
      const multiplier = type === '2-player' ? 1.8 : type === '4-player' ? 3.6 : 1;
  
      playerCountText.textContent = type.replace('-', ' ');
      winningsText.textContent = `${multiplier.toFixed(1)}X`;
  
      // Generate entry options
      requirements.innerHTML = entryFees.map(fee => {
        const winnings = Math.floor(fee * multiplier).toLocaleString();
        return `
          <div class="game-requirement-element">
            <div class="left">
              <span id="winnings-text">Potential Winnings</span>
              <span id="winnings-amount">₦${winnings}</span>
            </div>
            <div class="right">
              <button class="start-game-button" data-fee="${fee}">Pay N${fee.toLocaleString()}</button>
            </div>
          </div>
        `;
      }).join('');
  
      // Add logic for entry fee buttons
      document.querySelectorAll('.start-game-button').forEach((startBtn) => {
        startBtn.addEventListener('click', () => {
          const fee = parseInt(startBtn.getAttribute('data-fee'), 10);
  
          if (!loggedin) {
            warningWrapper.style.display = 'flex';
            loginWarning.style.display = 'flex';
            topupWarning.style.display = 'none';
            return;
          }
  
          if (userData.walletBalance < fee) {
            warningWrapper.style.display = 'flex';
            loginWarning.style.display = 'none';
            topupWarning.style.display = 'flex';
            return;
          }
  
          // Hide popup UI
          popup.style.display = 'none';
          lobby.style.display = 'none';
          gamePanel.style.display = 'none';
          requirements.style.display = 'none';
          unavailableMsg.style.display = 'none';
          warningWrapper.style.display = 'none';
  
          // Start game
          console.log(`✅ Starting game "${name}" with entry fee: N${fee}`);
          ShowSpinner("waiting for players");
          // loadGame(name, fee);
        });
      });
    });
  });
  