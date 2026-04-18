/**
 * MASTER GOOGLE APPS SCRIPT
 * ----------------------------
 * 1. Open Google Sheet
 * 2. Extensions > Apps Script
 * 3. Paste this code
 * 4. Deploy > New Deployment > Web App > Anyone has access
 */

const TEAMS = ["Onyx Strikers", "Onyx Rangers", "Onyx Titans", "Onyx Nemeses"];
const INITIAL_PURSE = 5000; // e.g., 50 Crores (expressed in Lakhs)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    writeLog(ss, data);
    writeGridRosters(ss, data);
    writeDashboard(ss, data);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeDashboard(ss, data) {
  let sheet = ss.getSheetByName("Dashboard") || ss.insertSheet("Dashboard", 0);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Team Name", "Initial Purse", "Spent", "Remaining", "Player Count"]);
    sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#dbeafe");
  }
  
  const values = sheet.getDataRange().getValues();
  let row = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.team) { row = i + 1; break; }
  }
  
  if (row === -1) {
    sheet.appendRow([data.team, INITIAL_PURSE, 0, INITIAL_PURSE, 0]);
    row = sheet.getLastRow();
  }
  
  sheet.getRange(row, 3).setFormula(`=SUMIF('Auction Log'!F:F, A${row}, 'Auction Log'!G:G)`);
  sheet.getRange(row, 4).setFormula(`=B${row}-C${row}`);
  sheet.getRange(row, 5).setFormula(`=COUNTIF('Auction Log'!F:F, A${row})`);
  sheet.autoResizeColumns(1, 5);
}

function writeGridRosters(ss, data) {
  let sheet = ss.getSheetByName("Team Rosters") || ss.insertSheet("Team Rosters");
  const slots = [
    { r: 1, c: 1 }, { r: 1, c: 5 }, { r: 15, c: 1 }, { r: 15, c: 5 }
  ];

  if (sheet.getRange("A1").getValue() === "") {
    slots.forEach((slot, index) => {
      const team = TEAMS[index] || "Pending Team";
      sheet.getRange(slot.r, slot.c, 1, 3).merge().setValue(team)
           .setFontWeight("bold").setHorizontalAlignment("center")
           .setBackground("#1e293b").setFontColor("white");
      sheet.getRange(slot.r + 1, slot.c, 1, 3).setValues([["Player", "Role", "Price"]])
           .setFontWeight("bold").setBackground("#f1f5f9").setBorder(true, true, true, true, true, true);
    });
  }

  const teamIndex = TEAMS.indexOf(data.team);
  if (teamIndex === -1) return;
  const slot = slots[teamIndex];
  let targetRow = slot.r + 2; 
  while (sheet.getRange(targetRow, slot.c).getValue() !== "" && targetRow < slot.r + 13) {
    targetRow++;
  }
  sheet.getRange(targetRow, slot.c, 1, 3).setValues([[ data.playerName, data.role, data.price ]])
       .setBorder(true, true, true, true, true, true);
  sheet.autoResizeColumns(1, 10);
}

function writeLog(ss, data) {
  let sheet = ss.getSheetByName("Auction Log") || ss.insertSheet("Auction Log");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "List Name", "Player ID", "Player Name", "Role", "Team", "Price"]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#f0f0f0");
  }
  sheet.appendRow([data.timestamp, data.listName, data.playerId, data.playerName, data.role, data.team, data.price]);
  sheet.autoResizeColumns(1, 7);
}
