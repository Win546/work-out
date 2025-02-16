document.addEventListener("DOMContentLoaded", () => {
    caricaAllenamenti();
    document.getElementById("salvaBtn").addEventListener("click", salvaAllenamento);
    document.getElementById("resetBtn").addEventListener("click", resettaScheda);
    
});

// Cambia scheda attiva
function showTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));

    document.getElementById(tabId).classList.add("active");
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add("active");
}

// Salva allenamento in LocalStorage
function salvaAllenamento() {
    let giorno = document.getElementById('giorno').value.trim();
    let esercizio = document.getElementById('esercizio').value.trim();
    let peso = document.getElementById('peso').value.trim();
    let ripetizioni = document.getElementById('ripetizioni').value.trim();

    if (!giorno || !esercizio || !peso || !ripetizioni) {
        alert("Compila tutti i campi!");
        return;
    }

    let allenamenti = JSON.parse(localStorage.getItem("allenamenti")) || {};

    if (!Array.isArray(allenamenti[giorno])) {
        allenamenti[giorno] = [];
    }

    allenamenti[giorno].push({ esercizio, peso, ripetizioni });

    localStorage.setItem("allenamenti", JSON.stringify(allenamenti));

    // Pulisce i campi dopo il salvataggio
    document.getElementById('esercizio').value = "";
    document.getElementById('peso').value = "";
    document.getElementById('ripetizioni').value = "";

    caricaAllenamenti();
}


// Salva allenamento in LocalStorage
function resettaScheda() {
    localStorage.setItem("allenamenti", JSON.stringify({})); // Imposta un array vuoto
    caricaAllenamenti();
}

// Carica e visualizza gli allenamenti in una tabella
function caricaAllenamenti() {
    let lista = document.getElementById("listaAllenamenti");
    lista.innerHTML = ""; // Pulisce la lista prima di aggiornarla

    let allenamenti = JSON.parse(localStorage.getItem("allenamenti")) || {};

    console.log("Dati caricati dal LocalStorage:", allenamenti); // Debug

    if (Object.keys(allenamenti).length === 0) {
        lista.innerHTML = "<p>Nessun allenamento salvato.</p>";
        return;
    }

    Object.keys(allenamenti).forEach(giorno => {
       
        if (!Array.isArray(allenamenti[giorno])) return;

        let giornoContainer = document.createElement("div");
        giornoContainer.classList.add("giorno-container");

        let titolo = document.createElement("h3");
        titolo.innerText = giorno;
        giornoContainer.appendChild(titolo);

        let table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th>Esercizio</th>
                <th>Peso</th>
                <th>Ripetizioni</th>
                <th>Azioni</th>
            </tr>
        `;

        allenamenti[giorno].forEach((item, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td contenteditable="true" onblur="modificaAllenamento('${giorno}', ${index}, 'esercizio', this.innerText)">${item.esercizio}</td>
                <td contenteditable="true" onblur="modificaAllenamento('${giorno}', ${index}, 'peso', this.innerText)">${item.peso} kg</td>
                <td contenteditable="true" onblur="modificaAllenamento('${giorno}', ${index}, 'ripetizioni', this.innerText)">${item.ripetizioni} reps</td>
                <td><button onclick="rimuoviAllenamento('${giorno}', ${index})">❌</button></td>
            `;
            table.appendChild(row);
        });

        giornoContainer.appendChild(table);
        lista.appendChild(giornoContainer);
    });
}


// Modifica un esercizio
function modificaAllenamento(giorno, index, campo, valore) {
    let allenamenti = JSON.parse(localStorage.getItem("allenamenti")) || {};
    allenamenti[giorno][index][campo] = valore;
    localStorage.setItem("allenamenti", JSON.stringify(allenamenti));
}

// Rimuove un esercizio
function rimuoviAllenamento(giorno, index) {
    let allenamenti = JSON.parse(localStorage.getItem("allenamenti")) || {};
    allenamenti[giorno].splice(index, 1);
    if (allenamenti[giorno].length === 0) {
        delete allenamenti[giorno];
    }
    localStorage.setItem("allenamenti", JSON.stringify(allenamenti));
    caricaAllenamenti();
}

function esportaPDF()
{
   var divToPrint=document.getElementById("listaAllenamenti");
   newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML);
   newWin.print();
   newWin.close();
}

