document.addEventListener('DOMContentLoaded', () => {
    const subjects = ['Inglês', 'Português', 'Ciências', 'Matemática', 'Geografia', 'História'];
    const tbody = document.getElementById('subject-entries');

    // Adicionar linhas para cada matéria
    subjects.forEach(subject => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${subject}</td>
            <td><input type="number" step="0.01" id="${subject}_ap1"></td>
            <td><input type="number" step="0.01" id="${subject}_ap2"></td>
            <td><input type="number" step="0.01" id="${subject}_ap3"></td>
            <td>
                <select id="${subject}_bonus" onchange="toggleBonusInput('${subject}')">
                    <option value="0">Não recebo ponto bônus</option>
                    <option value="custom">Digitar quanto ponto bônus eu recebi</option>
                </select>
                <input type="number" step="0.01" id="${subject}_custom_bonus" style="display: none;" placeholder="Digite o ponto bônus">
            </td>
        `;
        
        tbody.appendChild(row);
    });
});

function toggleBonusInput(subject) {
    const bonusSelect = document.getElementById(`${subject}_bonus`);
    const customBonusInput = document.getElementById(`${subject}_custom_bonus`);
    if (bonusSelect.value === 'custom') {
        customBonusInput.style.display = 'block';
    } else {
        customBonusInput.style.display = 'none';
    }
}

function calculateAverages() {
    const gipValue = parseFloat(document.getElementById('gip').value);
    const subjects = ['Inglês', 'Português', 'Ciências', 'Matemática', 'Geografia', 'História'];
    const resultsDiv = document.getElementById('results');
    let resultsHTML = '';

    subjects.forEach(subject => {
        const notes = [
            parseFloat(document.getElementById(`${subject}_ap1`).value),
            parseFloat(document.getElementById(`${subject}_ap2`).value),
            parseFloat(document.getElementById(`${subject}_ap3`).value)
        ].filter(n => !isNaN(n)); // Filtrar notas em branco

        let bonus = 0;
        const bonusSelect = document.getElementById(`${subject}_bonus`);
        if (bonusSelect.value === 'custom') {
            bonus = parseFloat(document.getElementById(`${subject}_custom_bonus`).value) || 0;
        } else {
            bonus = parseFloat(bonusSelect.value) || 0;
        }

        if (notes.length === 0) {
            resultsHTML += `<p>${subject}: Por favor, insira pelo menos uma nota.</p>`;
            return;
        }

        // Calcular a média das notas e garantir que não exceda 10
        const average = Math.min(notes.reduce((a, b) => a + b, 0) / notes.length, 10);
        const averageWithBonus = Math.min(average + bonus, 10);
        const averageWithGIP = Math.min(averageWithBonus + gipValue, 10);
        const averageWeighted = averageWithGIP * 0.4;
        const neededFor6 = Math.max(0, (6 - averageWeighted) / 0.6);
        const neededFor8 = Math.max(0, (8 - averageWeighted) / 0.6);

        resultsHTML += `
            <p>${subject}: Média de AP das ${notes.length} notas${bonus ? ' COM PONTO BÔNUS' : ''}${gipValue ? ' E GIP' : ''}: ${averageWithGIP.toFixed(1)}<br>
            Você precisa de ${neededFor6.toFixed(1)} pontos na AE para passar com média 6<br>
            Você precisa de ${neededFor8.toFixed(1)} pontos na AE para pegar Alamar.</p>
        `;
    });

    resultsDiv.innerHTML = resultsHTML;
}
