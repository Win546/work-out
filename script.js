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
    let serie = document.getElementById('serie').value.trim();
    let ripetizioni = document.getElementById('ripetizioni').value.trim();
    if (!giorno || !esercizio  || !ripetizioni || !serie) {
        alert("Compila tutti i campi!");
        return;
    }

    let allenamenti = JSON.parse(localStorage.getItem("allenamenti")) || {};

    if (!Array.isArray(allenamenti[giorno])) {
        allenamenti[giorno] = [];
    }

    allenamenti[giorno].push({ esercizio, peso, ripetizioni, serie });

    localStorage.setItem("allenamenti", JSON.stringify(allenamenti));

    // Pulisce i campi dopo il salvataggio
    document.getElementById('esercizio').value = "";
    document.getElementById('peso').value = "";
    document.getElementById('serie').value = "";
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
                 <th>Serie</th>
                <th>Ripetizioni</th>
                <th class="toRemove" >Azioni</th>
            </tr>
        `;

        allenamenti[giorno].forEach((item, index) => {
            let row = document.createElement("tr");
            let esercizio=item.esercizio;
            let esercizioCap =
            esercizio.charAt(0).toUpperCase()
                    + esercizio.slice(1)

            row.innerHTML = `
                <td class="nomeEsercizio" contenteditable="true" onblur="modificaAllenamento('${giorno}', ${index}, 'esercizio', this.innerText)">${esercizioCap}</td>
                <td contenteditable="true" onblur="modificaAllenamento('${giorno}', ${index}, 'peso', this.innerText)">${item.peso  ? item.peso + " " : "n.d" }</td>
                <td contenteditable="true" onblur="modificaAllenamento('${giorno}', ${index}, 'serie', this.innerText)">${item.serie} </td>
                <td contenteditable="true" onblur="modificaAllenamento('${giorno}', ${index}, 'ripetizioni', this.innerText)">${item.ripetizioni}</td>
                <td class="toRemove" ><button onclick="rimuoviAllenamento('${giorno}', ${index})">❌</button></td>
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
   divToPrint.querySelectorAll('.toRemove').forEach(e => e.remove());
    let printWindow = window.open('', '', 'width=800,height=600');
            
            printWindow.document.write('<html><head><title>Stampa Tabella</title>');
            
            // Copia tutti i CSS dalla pagina
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                printWindow.document.write(`<link rel="stylesheet" href="${link.href}">`);
            });

            printWindow.document.write('</head><body><h1>Scheda Allenamento</h1>');
            printWindow.document.write(divToPrint.outerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();

            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
}

