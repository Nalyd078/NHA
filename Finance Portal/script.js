let rekeningen = [];

function toonRekeningen() {
    const vandaag = new Date();
    rekeningen.sort((a, b) => new Date(a.vervalDatum) - new Date(b.vervalDatum));
    const lijstContainer = document.getElementById('rekeningenContainer1');
    lijstContainer.innerHTML = ''; // Maak alleen de container voor rekening-items leeg

    rekeningen.forEach((rekening, index) => {
        if (new Date(rekening.vervalDatum) > vandaag) {
            const item = document.createElement('div');
            item.classList.add('rekening-item');
            item.addEventListener('click', () => activeerItem(item, index));

            const formatDatum = formateerDatum(rekening.vervalDatum);
            item.innerHTML = `${rekening.onderwerp}<span class="bedrag-span" onclick="maakBedragBewerkbaar(event, ${index})">€ ${rekening.bedrag.toFixed(2)}</span>${formatDatum} <button class="verwijder-knop">Verwijder</button>`;
            lijstContainer.appendChild(item);
        }
    });

    berekenTotaalBedrag();
}

function laadRekeningen() {
    const opgeslagenRekeningen = localStorage.getItem('rekeningen');
    if (opgeslagenRekeningen) {
        rekeningen = JSON.parse(opgeslagenRekeningen);
    }
    toonRekeningen();
    berekenTotaalBedrag();
}

// Zorg ervoor dat deze functie wordt aangeroepen bij het laden van de pagina
document.addEventListener('DOMContentLoaded', laadRekeningen);

function voegRekeningToe() {
    const onderwerpInput = document.getElementById('onderwerpInput').value;
    const bedragInput = document.getElementById('bedragInput').value;
    const datumInput = document.getElementById('datumInput').value;

    if (!onderwerpInput || !bedragInput || !datumInput) {
        alert('Voer alle velden in (onderwerp, bedrag en datum).');
        return;
    }

    rekeningen.push({
        onderwerp: onderwerpInput,
        bedrag: parseFloat(bedragInput), 
        vervalDatum: datumInput
    });
    toonRekeningen();
    slaRekeningenOp();
    document.getElementById('onderwerpInput').value = '';
    document.getElementById('bedragInput').value = '';
    document.getElementById('datumInput').value = '';
}

function verwijderRekening(index) {
    rekeningen.splice(index, 1);
    toonRekeningen();
    slaRekeningenOp();
}

function slaRekeningenOp() {
    localStorage.setItem('rekeningen', JSON.stringify(rekeningen));
}

function laadRekeningen() {
    const opgeslagenRekeningen = localStorage.getItem('rekeningen');
    if (opgeslagenRekeningen) {
        rekeningen = JSON.parse(opgeslagenRekeningen);
    }
    toonRekeningen();
    berekenTotaalBedrag(); // Voeg deze regel toe om het totaalbedrag na het laden van rekeningen bij te werken.
}

function formateerDatum(datum) {
    const d = new Date(datum);
    let dag = d.getDate();
    let maand = d.getMonth() + 1;
    const jaar = d.getFullYear();

    if (dag < 10) dag = '0' + dag;
    if (maand < 10) maand = '0' + maand;

    return `${dag}-${maand}-${jaar}`;
}

function activeerItem(item, index) {
    if (!item.classList.contains('actief')) {
        // Verwijder 'actief' van alle items
        document.querySelectorAll('.rekening-item').forEach(i => i.classList.remove('actief'));

        // Voeg 'actief' toe aan het geklikte item
        item.classList.add('actief');

        // Zet de verwijderknop event handler
        item.querySelector('.verwijder-knop').onclick = (event) => {
            event.stopPropagation();
            verwijderRekening(index);
        };
    } else {
        item.classList.remove('actief');
    }
}

function maakBedragBewerkbaar(event, index) {
    event.stopPropagation();
    const span = event.target;
    
    // Zorg ervoor dat de verwijderknop op de regel wordt weergegeven
    const item = span.closest('.rekening-item');
    if (item) {
        item.querySelector('.verwijder-knop').style.display = 'inline-block';
    }
    
    const input = document.createElement('input');
    input.type = 'number';
    input.value = rekeningen[index].bedrag;
    
    input.onblur = () => slaBedragOp(input, index, span);
    span.parentNode.replaceChild(input, span);
    input.focus();
}

function slaBedragOp(input, index, span) {
    const nieuwBedrag = input.value;
    rekeningen[index].bedrag = parseFloat(nieuwBedrag);
    span.innerHTML = `€${nieuwBedrag}`;
    input.parentNode.replaceChild(span, input);
    slaRekeningenOp();
    toonRekeningen();
}

function berekenTotaalBedrag() {
    const vandaag = new Date();
    let totaal = 0;

    rekeningen.forEach((rekening) => {
        const vervaldatum = new Date(rekening.vervalDatum);
        if (vervaldatum > vandaag) {
            totaal += rekening.bedrag;
        }
    });

    const totaalBedragElement = document.getElementById('totaalBedrag');
    totaalBedragElement.innerHTML = `<h2 style="padding: 10px 0;">Totaal: €${totaal.toFixed(2)}</h2>`;
}

document.getElementById('toevoegenBtn').addEventListener('click', voegRekeningToe);
laadRekeningen();

document.getElementById('schakelLijstenBtn').addEventListener('click', () => {
    const lijst1 = document.getElementById('rekeningenLijst1');
    const lijst2 = document.getElementById('rekeningenLijst2');
    console.log("TEST");

    if (lijst1.style.display === 'none') {
        lijst1.style.display = 'block';
        lijst2.style.display = 'none';
    } else {
        lijst1.style.display = 'none';
        lijst2.style.display = 'block';
    }
});