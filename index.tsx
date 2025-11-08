import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

declare const XLSX: any;

const initialStatementData = {
    id: 'user_1',
    customerNumber: '404644512',
    accountNumber: '20200079429298',
    productType: 'SB Standard - 5000 AQB',
    accountType: 'SAVINGS',
    mabRequirement: '5000',
    nomineeRegistered: 'YES',
    accountTitle: 'SURENDER SINGH',
    jointHolder: '',
    address: `S/O: GAJE SINGH 28-B GALI NO 2\nGANDHI NAGAR\nKARNAL (RURAL)(PART)(1)\nKARNAL\nHaryana\nINDIA\n132001`,
    ckycNumber: 'XXXXXXXXXX2280',
    branchOfOwnership: 'Peoha Branch',
    branchPhoneNumber: '8981624402',
    emailAddress: 'pehowa.branch@bandhanbank.com',
    branchId: '2440',
    accountBranch: 'Peoha Branch',
    ifsc: 'BDBL0002440',
    micr: '132750252',
    branchGstin: '06AAGCB1323G1Z7',
    branchAddress: `Bandhan bank ltd, Ground floor\nSaini Eng Workshop, Opp DAV Colledge\nAmbala Road,Pehowa,Kurukshetra,Haryana\nPeoha\nHaryana\nIN\n136128`,
    fromDate: '01-APR-2025',
    toDate: '09-OCT-2025',
    currency: 'Indian',
    openingBalance: 0.00,
    transactions: [
        { id: 't1', transDate: '01-APR-\n2025', valueDate: '01-APR-\n2025', description: 'B/F ...', debit: 0.00, credit: 0.00 },
        { id: 't2', transDate: '23-APR-\n2025', valueDate: '23-APR-\n2025', description: 'IP TRANSFER\nSURENDER SINGH\nPEOHA BRANCH', debit: 0.00, credit: 11000.00 },
        { id: 't3', transDate: '23-APR-\n2025', valueDate: '23-APR-\n2025', description: 'DEBIT CARD ISSUANCE\nFEES EXCLUSIVE OF\nGST', debit: 300.00, credit: 0.00 },
        { id: 't4', transDate: '23-APR-\n2025', valueDate: '23-APR-\n2025', description: 'GST 1820-GST', debit: 54.00, credit: 0.00 },
        { id: 't5', transDate: '09-MAY-\n2025', valueDate: '09-MAY-\n2025', description: 'RTGS CR-HDFC BANK-\nSTAR ENTERPRISES-\nHDFCR5202505096', debit: 0.00, credit: 815000.00 },
        { id: 't6', transDate: '09-MAY-\n2025', valueDate: '09-MAY-\n2025', description: 'INITIAL PAYIN\nFD82000086776970 /1\nSURENDER SINGH', debit: 810631.00, credit: 0.00 },
        { id: 't7', transDate: '10-MAY-\n2025', valueDate: '10-MAY-\n2025', description: 'RTGS CR-INDUSIND\nBANK-TURNING LIFE-\nINDBR3202505100', debit: 0.00, credit: 450000.00 },
        { id: 't8', transDate: '10-MAY-\n2025', valueDate: '10-MAY-\n2025', description: 'NEFT CR-INDB0000006-\nTURNING LIFE-\nINDBN520250510036', debit: 0.00, credit: 455000.00 },
        { id: 't9', transDate: '12-MAY-\n2025', valueDate: '12-MAY-\n2025', description: 'INITIAL PAYIN\nFD82000086962617 /1\nSURENDER SINGH', debit: 897098.00, credit: 0.00 },
        { id: 't10', transDate: '18-JUN-\n2025', valueDate: '18-JUN-\n2025', description: 'INTERNAL\nTRF/RIB/1000/FROM-\nSURENDER SINGH/TO-\nSUREN', debit: 0.00, credit: 150000.00 },
        { id: 't11', transDate: '18-JUN-\n2025', valueDate: '18-JUN-\n2025', description: 'INTERNAL\nTRF/RIB/1000/FROM-\nSURENDER SINGH/TO-\nSUREN', debit: 0.00, credit: 50000.00 },
        { id: 't12', transDate: '18-JUN-\n2025', valueDate: '18-JUN-\n2025', description: 'RTGS-\nBDBLR62025061819124', debit: 200000.00, credit: 0.00 },
        { id: 't13', transDate: '30-JUN-\n2025', valueDate: '30-JUN-\n2025', description: 'CASA CREDIT\nINTEREST\nCAPITALIZED', debit: 0.00, credit: 307.00 },
        { id: 't14', transDate: '30-SEP-\n2025', valueDate: '30-SEP-\n2025', description: 'CASH DEP-TP-CASH\nDEPOSIT BY SANDEEP\nPEOHA BRANCH', debit: 0.00, credit: 100000.00 },
        { id: 't15', transDate: '30-SEP-\n2025', valueDate: '30-SEP-\n2025', description: 'CASA CREDIT\nINTEREST\nCAPITALIZED', debit: 0.00, credit: 174.00 },
    ],
};

const BANK_SEAL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAYFBMVEX///8zM2YzM2YzM2bMzMyZmZkAAAAzM2YzM2YzM2bMzMyZmZkAAAAzM2YzM2YzM2bMzMyZmZkAAAAzM2YzM2YzM2bMzMyZmZkAAAAzM2YzM2YzM2bMzMyZmZkAAAAzM2YzM2YzM2bMzMyZmZmcxHsFAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAMJSURBVHja7JvblqsgEIXRDCihgKCCCu//ikdVXQzT6b5v5+DctV/VVE1VjYwEAAAAAAAAAAAAAADg/6vWw7Rerz+tWlYd5qI0/Z5tWn2K1s+2hB/007R5tW7tF3YfWk15DduG9KPbAevJ18U0r+cveg27jXwjWufvUo+wB1dDvjM/J7qC5H0/Yd++G5494Nl7jH0sQejmH01gA2U2B1dDk7f1gO6hJ36/qAv63kU91gK6wZ3zI/dM6rU4e9A197n44u8P6pT3oGvpGfgL6v2vK99AD6L0b6N++vU4/dAB99dK3nU/eD9dDez7UjO6C/fQW9H7/gP52wZ3jA+h92z+g3wW705/Tpx270W95jO50/3kO+r/9/t8N9O97H/TrR/rY82tQfXvQY89XQfX7qAcd9D7aU3v0bU/d0WfM3V03uLd/s54c3X1O0b985OjfRfr+u4t64cjd3XfK0Sdd93eU195f19cQ3V3q6M7nF/X49K3n9Vf18eW6q34/uT7P3V0/uN/ZXT06e/kF/eG13N0x3H4B/fE17+5uR/n3/oV6cXO3d/y8Pq+6v6Cuzf2i7r5V3l30X3d/eU3RX+9P7h50T3p/Qf/2qbr7F/2l7s8F+sNV3d3oR3d/ef3/z/uP7p60G009+uD3T+7uqbv3x4N62+7u+l1v6G7/h37+h3q6v+O/7X86U90D9XcX9fCju1+f2f3wIbrr1+8o6vV3B/XxH3f/vE3Xv+s/6t/d/vQ1f4D+e+o+hV0n0f/p8/5D/rO7/qO/+i9A/6p+7P/6H0d35817qf6B+iH3H5R/0b+kP/Vf/xM+Afs//X/vR/8D/P4Ld9P+hL7Y/+39M/b2+hH18Tvt8HegN9AAAAAAAAAAAAAADgX/AFeVp8j1W19TcAAAAASUVORK5CYII=";
const BANDHAN_BANK_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMzIiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojZWUwMDMyfTwvc3RylZT4uY2xzLTF7ZmlsbDojZWUwMDMyfTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyNC43NywxMC40M3Y2LjI3YzAsMS44OS0uNjcsMi44MS0yLDIuODFoLTYuNjljLS43OSwwLTEuMTctLjM2LTEuMTctMS4wN1YxMC40M2MwLS43Ny40MS0xLjA4LDEuMTctMS4wOGg2LjY5QzEyNC4xLDkuMzUsMTI0Ljc3LDkuNjYsMTI0Ljc3LDEwLjQzWm0tMi4zMyw0Ljg4VjExLjc2aC00LjM1djMuNTRaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTExLjg4LDE5LjQ5di0uMDZjMC0uNzgtLjM5LTEuMTYtMS4xMy0xLjE2aC00Ljc0VjkuNjFoNC41MmMuNzQsMCwxLjEzLS4zOCwxLjEzLTEuMTZ2LS4wNmMwLS43OC0uMzktMS4xNi0xLjEzLTEuMTZIMTAzLjJjLS43NCwwLTEuMTMuMzgtMS4xMywxLjE2VjIwLjY1Yy4wNS43OC4zOSwxLjE2LDEuMTMsMS4xNmg4Ljc5Yy43NCwwLDEuMTMtLjM4LDEuMTMtMS4xNlYyMC42QzExMywyMC4wOCwxMTIuNjIsMTkuNDksMTExLjg4LDE5LjQ5WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTk4LjcxLDE4LjEzaC02Yy0uNzQsMC0xLjEzLjM4LTEuMTMsMS4xNnYwYzAsLjc4LjM5LDEuMTYsMS4xMywxLjE2aDguNzlDNTEuNTIsMjAuNDUsMTAyLjIsMjAuMDgsMTAyLjIsMTkuMzR2LS4wNmMwLS43OC0uMzktMS4xNi0xLjEzLTEuMTZoLTQuNzF2LTcuNDZoNC41MmMuNzQsMCwxLjEzLS4zOCwxLjEzLTEuMTZ2LS4wNmMwLS43OC0uMzktMS4xNi0xLjEzLTEuMTZIOS41OGMtLjc0LDAtMS4xMy4zOC0xLjEzLDEuMTZWMTcuNTFDLjg4Ljc0LDE3Ljc1Ljg5LjE2LDE4LjEzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTgxLjc4LDkuMzVoMi4zM2MuNzQsMCwxLjEzLjM4LDEuMTMsMS4xNnYwYzAsLjc4LS4zOSwxLjE2LTEuMTMsMS4xNmgtMi4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik04MS42NywxNC45MnY1Ljc0YzAsLjc4LjM5LDEuMTYsMS4xMywxLjE2aDguNzlDMzIuNDMsMjEuODEsOTMuMSwyMS40NSw5My4xLDIwLjY4di0uMDZjMC0uNzgtLjM5LTEuMTYtMS4xMy0xLjE2aC02di0xMGg2Yy43NCwwLDEuMTMtLjM4LDEuMTMtMS4xNlY4LjIzYzAtLjc4LS4zOS0xLjE2LTEuMTMtMS4xNkg4Mi44QzgyLjA2LDcsODEuNjcsNy4zOCw4MS42Nyw4LjEzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTcxLjI0LDkuMzVoMi4zM2MuNzQsMCwxLjEzLjM4LDEuMTMsMS4xNnYwYzAsLjc4LS4zOSwxLjE2LTEuMTMsMS4xNmgtMi4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03MS4xMywxNC45MnY1Ljc0YzAsLjc4LjM5LDEuMTYsMS4xMywxLjE2aDguNzlDNzEuOTcsMjEuODEsODIuNTYsMjEuNDUsODIuNTYsMjAuNjh2LS4wNmMwLS43OC0uMzktMS4xNi0xLjEzLTEuMTZoLTZ2LTEwaDZjLjc0LDAsMS4xMy0uMzgsMS4xMy0xLjE2VjguMjNjMC0uNzgtLjM5LTEuMTYtMS4xMy0xLjE2SDcyLjI2QzcxLjUyLDcsNzEuMTMsNy4zOCw3MS4xMyw4LjEzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYyLjUxLDE5LjQ5di0uMDZjMC0uNzgtLjM5LTEuMTYtMS4xMy0xLjE2aC00Ljc0VjkuNjFoNC41MmMuNzQsMCwxLjEzLS4zOCwxLjEzLTEuMTZ2LS4wNmMwLS43OC0uMzktMS4xNi0xLjEzLTEuMTZINTMuNjhjLS43NCwwLTEuMTMuMzgtMS4xMywxLjE2VjIwLjY1Yy4wNS43OC4zOSwxLjE2LDEuMTMsMS4xNmg4LjkzYy43NCwwLDEuMTMtLjM4LDEuMTMtMS4xNlYyMC42QzYzLjY0LDIwLjA4LDYzLjI2LDE5LjQ5LDYyLjUxLDE5LjQ5WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQzLjkzLDYuODdjLTEuNzQtLjA3LTMuNjQtLjE0LTUuNDUtLjE0SDM4Yy0zLjYsMC01LjM2LDEuMzYtNS4zNiwzLjg0VjEwYzAsMS40OS40MSwyLjE2LDEuMzUsMi4xNmguMDhjMS4wOCwwLDEuNTQtLjY7LDEuNTQtMS45MVY5Ljg1YzAtLjY3LjI1LS45Mi44OC0uOTJoLjQxYy42MywwLC44OC4yNS44OC45MnYxMC44YzAsMS0uNDEsMS40My0xLjI2LDEuNDNIMzZjLTEuMzUsMC0xLjg0LS41OC0xLjg0LTEuODV2LTQuMDZjMC0xLjU4LS40MS0yLjI1LTEuMzUtMi4yNWgtLjA4Yy0xLjA4LDAtMS41NC42Ny0xLjU0LDEuOTRWMTguNWMwLDIuNDgsMS43NiwzLjg0LDUuMzYsMy4oNGguNDljMS44MSwwLDMuNzEtLjA3LDUuNDUtLjE0LDIuMDYtLjA4LDMuNTQtLjY3LDMuNTQtMi4zOHYtMTBDNDcuNDYsNy41NCw0NiwyLDQzLjkzLDYuODdaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjAuNTMsMjEuNzNoMi4zM2wxLjU4LTIuMjloNC4wOGwxLjU4LDIuMjloMi4zM0wyOC4xMyw3aC0yLjM5Wm00LjI2LTQuMDVoLTMuNTNsMS43Ni0yLjUxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE4Ljc2LDE4LjEzaC02Yy0uNzQsMC0xLjEzLjM4LTEuMTMsMS4xNnYwYzAsLjc4LjM5LDEuMTYsMS4xMywxLjE2aDguNzlDMTIuNDUsMjAuNDUsMTMuMTIsMjAuMDgsMTMuMTIsMTkuMzR2LS4wNmMwLS43OC0uMzktMS4xNi0xLjEzLTEuMTZoLTQuNzF2LTcuNDZoNC41MmMuNzQsMCwxLjEzLS4zOCwxLjEzLTEuMTZ2LS4wNmMwLS43OC0uMzktMS4xNi0xLjEzLTEuMTZIMS41MWMtLjc0LDAtMS4xMy4zOC0xLjEzLDEuMTZWMTcuNTFDOS42OCwxNy43NSwxMC4wNywxOC4xMywxMC43MSwxOC4xM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zLjQsMTMuNjVjMC0zLjg0LDEuODgtNS44MSw1LjA1LTUuODFoLjI5Yy44OCwwLDEuMy4yLDEuNjQuNnYtLjQ4YzAtLjc4LS4zOS0xLjE2LTEuMTMtMS4xNkg3LjEzYy0uNzQsMC0xLjEzLS4zOC0xLjEzLTEuMTZ2LS4wNmMwLS43OC4zOSwxLjE2LDEuMTMtMS4xNmgyLjgxYy43MywwLDEuMTQuMzgsMS4xNCwxLjE2VjE5LjM0YzAsLjc4LS4zOSwxLjE2LTEuMTMsMS4xNmgtLjI5Yy0uODgsMC0xLjMtLjItMS42NC0uNnYxLjQzYzAsLjc4LS4zOSwxLjE2LTEuMTMsMS4xNkg3LjEzYy0uNzQsMC0xLjEzLS4zOC0xLjEzLTEuMTZ2LS4wNmMwLS43OC4zOSwxLjE2LDEuMTMtMS4xNmgyLjM4VjE2LjFjLTIuNjYtLjY3LTQuMTEtMi45Ny00LjExLTUgMC0uNDQtLjAyLS44OC0uMDYtMS40NVptNi4yNCwxLjQzVjEwLjdjMC0uNzgtLjM5LTEuMTYtMS4xMy0xLjE2aC0uMmMtMS4wOSwwLTEuNzUuNzItMS43NSwyLjQxLDAsMS42OS42MywyLjQxLDEuNzUsMi40MWguMkMxLjI5LDE2LjM4LDkuNjQsMTUuNzUsOS42NCwxNS4wOFoiLz48L3N2Zz4=";

function getStorageValue(key, defaultValue) {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing JSON from localStorage', error);
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item to localStorage', error);
    }
  }, [key, value]);

  return [value, setValue];
};

const EditIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);
const TrashIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.037-2.124H9.773c-1.127 0-2.037.944-2.037 2.124v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);
const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);
const PrintIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Z" />
    </svg>
);
const DownloadIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
const UploadIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);
const MenuIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
const CloseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

// FIX: Add explicit types for Modal props to fix 'children' is missing error.
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const TransactionForm = ({ isOpen, onClose, onSave, transaction, isNew }) => {
  const [formData, setFormData] = useState(transaction);

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'debit' || name === 'credit' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isNew ? "Add Transaction" : "Edit Transaction"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
            <input type="text" name="transDate" value={formData.transDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="DD-MMM-YYYY"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value Date</label>
            <input type="text" name="valueDate" value={formData.valueDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="DD-MMM-YYYY"/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Debit</label>
            <input type="number" step="0.01" name="debit" value={formData.debit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit</label>
            <input type="number" step="0.01" name="credit" value={formData.credit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 mr-2">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Save</button>
        </div>
      </form>
    </Modal>
  );
};

// FIX: Make existingData prop optional with a default value to allow usage for creating new users.
const UserForm = ({ isOpen, onClose, onSave, existingData = null }) => {
  const emptyForm = {
      customerNumber: '', accountNumber: '', productType: '', accountType: '', mabRequirement: '',
      nomineeRegistered: 'YES', accountTitle: '', jointHolder: '', address: '', ckycNumber: '',
      branchOfOwnership: '', branchPhoneNumber: '', emailAddress: '', branchId: '', accountBranch: '',
      ifsc: '', micr: '', branchGstin: '', branchAddress: '', fromDate: '', toDate: '',
      currency: 'Indian', openingBalance: 0,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (existingData) {
      const { id, transactions, ...details } = existingData;
      setFormData(details);
    } else {
      setFormData(emptyForm);
    }
  }, [existingData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'openingBalance' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderInputField = (label, name, type = 'text', isTextarea = false) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isTextarea ? (
            <textarea name={name} value={String(formData[name] || '')} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        ) : (
            <input type={type} name={name} value={String(formData[name] || '')} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingData ? "Edit User Details" : "Add New User"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInputField("Account Title", "accountTitle")}
            {renderInputField("Customer Number", "customerNumber")}
            {renderInputField("Account Number", "accountNumber")}
            {renderInputField("Product Type", "productType")}
            {renderInputField("Account Type", "accountType")}
            {renderInputField("MAB/QAB Requirement", "mabRequirement")}
            <div>
                <label className="block text-sm font-medium text-gray-700">Nominee Registered</label>
                <select name="nomineeRegistered" value={formData.nomineeRegistered} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option>YES</option>
                    <option>NO</option>
                </select>
            </div>
            {renderInputField("CKYC Number", "ckycNumber")}
            {renderInputField("Branch of Ownership", "branchOfOwnership")}
            {renderInputField("Branch Phone", "branchPhoneNumber")}
            {renderInputField("Email Address", "emailAddress")}
            {renderInputField("Branch ID", "branchId")}
            {renderInputField("Account Branch", "accountBranch")}
            {renderInputField("IFSC", "ifsc")}
            {renderInputField("MICR", "micr")}
            {renderInputField("Branch GSTIN", "branchGstin")}
            {renderInputField("From Date", "fromDate")}
            {renderInputField("To Date", "toDate")}
            {renderInputField("Opening Balance", "openingBalance", "number")}
            {renderInputField("Address", "address", 'text', true)}
            {renderInputField("Branch Address", "branchAddress", 'text', true)}
        </div>
        <div className="flex justify-end pt-4 border-t mt-6">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 mr-2">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Save</button>
        </div>
      </form>
    </Modal>
  );
};

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

const TransactionTable = ({ transactions }) => (
    <table className="w-full border-collapse border border-black text-[8pt] table-fixed text-black">
        <thead className="bg-gray-100">
            <tr>
                <th className="border border-black p-1 font-bold text-center uppercase w-[10%]">TRANS DATE</th>
                <th className="border border-black p-1 font-bold text-center uppercase w-[10%]">VALUE DATE</th>
                <th className="border border-black p-1 font-bold text-center uppercase w-[11%]">CHEQUE / INSTRUMENT</th>
                <th className="border border-black p-1 font-bold text-center uppercase w-[30%]">DESCRIPTION</th>
                <th className="border border-black p-1 font-bold text-center uppercase w-[13%]">DEBITS</th>
                <th className="border border-black p-1 font-bold text-center uppercase w-[13%]">CREDITS</th>
                <th className="border border-black p-1 font-bold text-center uppercase w-[13%]">BALANCE</th>
            </tr>
        </thead>
        <tbody>
            {transactions.map((tx) => (
                <tr key={tx.id}>
                    <td className="border border-black p-1 text-center whitespace-pre-line">{tx.transDate}</td>
                    <td className="border border-black p-1 text-center whitespace-pre-line">{tx.valueDate}</td>
                    <td className="border border-black p-1 text-center">{tx.chequeInstrument || ''}</td>
                    <td className="border border-black p-1 whitespace-pre-line break-words">{tx.description}</td>
                    <td className="border border-black p-1 text-right">{tx.debit > 0 ? formatCurrency(tx.debit) : ''}</td>
                    <td className="border border-black p-1 text-right">{tx.credit > 0 ? formatCurrency(tx.credit) : ''}</td>
                    <td className="border border-black p-1 text-right">{formatCurrency(tx.balance)}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const PageFooter = () => (
    <footer className="text-[7pt] mt-auto relative pt-4">
        <p>Each depositor in our bank is insured up to a maximum of INR 5,00,000 (Rupees Five Lakhs) for both principal and interest amount held in Deposit Account, as per DICGC norms. Details on Deposit Insurance Cover, Terms & Conditions governing your deposit account are incorporated in Most Important Document (MID). MID & Schedule of Charges is available on our website www.bandhanbank.com - A copy of the same may be obtained from Bandhan Bank Branch" Unless the constituent notifies the Bank of any discrepancy in this statement within 15 days from the date of statement, it will be construed that this transaction(s) in the statement are correct. This is a computer generated statement requires no signature.</p>
        <img src={BANK_SEAL} alt="Bank Seal" className="absolute right-10 -bottom-5 w-24 h-24 opacity-80"/>
    </footer>
);

const StatementPreview = ({ statementData, transactionsWithBalance, summary }) => {
    const ROWS_PER_PAGE_FIRST = 12;
    const ROWS_PER_PAGE_SUBSEQUENT = 24;

    const pages = [];
    let transactionsCopy = [...transactionsWithBalance];

    if (transactionsCopy.length > 0) {
        pages.push(transactionsCopy.splice(0, ROWS_PER_PAGE_FIRST));
    } else {
        pages.push([]);
    }

    while (transactionsCopy.length > 0) {
        pages.push(transactionsCopy.splice(0, ROWS_PER_PAGE_SUBSEQUENT));
    }

    return (
        <div id="statement-preview-container" className="bg-white shadow-lg statement-preview-container">
            {pages.map((pageTransactions, pageIndex) => (
                <div key={pageIndex} className="page-break" style={{ width: '210mm', minHeight: '297mm', padding: '15mm', display: 'flex', flexDirection: 'column', color: 'black', lineHeight: '1.3', fontSize: '9pt' }}>
                    <header>
                        <img src={BANDHAN_BANK_LOGO} alt="Bandhan Bank" className="h-6 mb-4"/>
                    </header>

                    {pageIndex === 0 && (
                        <>
                            <div className="flex justify-between items-start mb-3 text-[8.5pt]">
                                <div className="w-3/5 pr-4">
                                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-px">
                                        <span className="font-bold">Customer Number:</span><span>{statementData.customerNumber}</span>
                                        <span className="font-bold">Account No:</span><span>{statementData.accountNumber}</span>
                                        <span className="font-bold">Product Type:</span><span>{statementData.productType}</span>
                                        <span className="font-bold">Account Type:</span><span>{statementData.accountType}</span>
                                        <span className="font-bold">MAB/QAB Requirement:</span><span>{statementData.mabRequirement}</span>
                                        <span className="font-bold">Nominee Registered:</span><span>{statementData.nomineeRegistered}</span>
                                        <span className="font-bold">Account Title:</span><span>{statementData.accountTitle}</span>
                                        <span className="font-bold">Joint Holder:</span><span>{statementData.jointHolder}</span>
                                    </div>
                                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-px mt-2">
                                        <span className="font-bold align-top">Address:</span><span className="whitespace-pre-line">{statementData.address}</span>
                                    </div>
                                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-px mt-2">
                                        <span className="font-bold">Primary customer's CKYC number:</span><span>{statementData.ckycNumber}</span>
                                    </div>
                                </div>
                                <div className="w-2/5 pl-4 text-left">
                                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-px">
                                        <span className="font-bold">Branch of Ownership:</span><span>{statementData.branchOfOwnership}</span>
                                        <span className="font-bold">Branch Phone Number:</span><span>{statementData.branchPhoneNumber}</span>
                                        <span className="font-bold">Email Address:</span><span>{statementData.emailAddress}</span>
                                        <span className="font-bold">Branch ID:</span><span>{statementData.branchId}</span>
                                        <span className="font-bold">Account Branch:</span><span>{statementData.accountBranch}</span>
                                        <span className="font-bold">IFSC:</span><span>{statementData.ifsc}</span>
                                        <span className="font-bold">MICR:</span><span>{statementData.micr}</span>
                                        <span className="font-bold">Branch GSTIN:</span><span>{statementData.branchGstin}</span>
                                        <span className="font-bold align-top">Branch Address:</span><span className="whitespace-pre-line">{statementData.branchAddress}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center my-2">
                                <h2 className="font-bold text-[10pt] tracking-wider border-b border-black inline-block pb-px">STATEMENT OF ACCOUNT</h2>
                            </div>
                            
                            <div className="flex justify-between items-end mb-2 text-[8.5pt]">
                                <div>
                                    From Date:<span className="font-bold ml-2">{statementData.fromDate.replace('\n', ' ')}</span>
                                    <div className="text-[7.5pt]">Rupee</div>
                                </div>
                                <div className="text-center">To Date:<span className="font-bold ml-2">{statementData.toDate.replace('\n', ' ')}</span></div>
                                <div className="text-right">Currency Name: <span className="font-bold ml-2">{statementData.currency}</span></div>
                            </div>
                        </>
                    )}
                    
                    <TransactionTable transactions={pageTransactions} />

                    {pageIndex === pages.length - 1 && (
                        <>
                            <div className="my-3">
                                <h3 className="font-bold text-[9pt]">Statement Summary:</h3>
                                <table className="w-full border-collapse border border-black text-[8pt] mt-1">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-black p-1 font-bold text-center">Opening Balance</th>
                                            <th className="border border-black p-1 font-bold text-center">Total Debit Amount</th>
                                            <th className="border border-black p-1 font-bold text-center">Total Credit Amount</th>
                                            <th className="border border-black p-1 font-bold text-center">Dr./Cr.</th>
                                            <th className="border border-black p-1 font-bold text-center">Debit Count</th>
                                            <th className="border border-black p-1 font-bold text-center">Credit Count</th>
                                            <th className="border border-black p-1 font-bold text-center">Closing Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-black p-1 text-center">{formatCurrency(statementData.openingBalance)}</td>
                                            <td className="border border-black p-1 text-center">{formatCurrency(summary.totalDebit)}</td>
                                            <td className="border border-black p-1 text-center">{formatCurrency(summary.totalCredit)}</td>
                                            <td className="border border-black p-1 text-center">{summary.closingBalance >= 0 ? 'C' : 'D'}</td>
                                            <td className="border border-black p-1 text-center">{summary.debitCount}</td>
                                            <td className="border border-black p-1 text-center">{summary.creditCount}</td>
                                            <td className="border border-black p-1 text-center">{formatCurrency(summary.closingBalance)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-center font-bold my-3 text-[9pt]">******END OF STATEMENT******</p>
                        </>
                    )}
                    
                    <PageFooter />
                </div>
            ))}
        </div>
    );
};

const StatementEditor = ({ statementData, onSave, transactionsWithBalance, summary }) => {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isNewTransaction, setIsNewTransaction] = useState(false);
  const [isUserDetailsEditorOpen, setIsUserDetailsEditorOpen] = useState(false);
  const importFileRef = useRef(null);

  const handlePrint = () => window.print();

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(statementData.transactions.map(t => ({
        'Transaction Date': t.transDate.replace(/\n/g, ' '),
        'Value Date': t.valueDate.replace(/\n/g, ' '),
        'Description': t.description.replace(/\n/g, ' '),
        'Cheque / Instrument': t.chequeInstrument || '',
        'Debit': t.debit,
        'Credit': t.credit
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, `Transactions-${statementData.accountTitle}.xlsx`);
  };

  const handleImportClick = () => importFileRef.current?.click();

  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            
            const newTransactions = json.map((row, index) => ({
                id: `imported_${Date.now()}_${index}`,
                transDate: row['Transaction Date'] || '',
                valueDate: row['Value Date'] || '',
                description: row['Description'] || '',
                chequeInstrument: row['Cheque / Instrument'] || '',
                debit: parseFloat(row['Debit']) || 0,
                credit: parseFloat(row['Credit']) || 0,
            }));

            onSave({ ...statementData, transactions: [...statementData.transactions, ...newTransactions] });
        };
        reader.readAsBinaryString(file);
        event.target.value = ''; 
    }
  };
  
  const handleSaveTransaction = useCallback((transaction) => {
    let updatedTransactions;
    if (isNewTransaction) {
      updatedTransactions = [...statementData.transactions, { ...transaction, id: `txn_${Date.now()}` }];
    } else {
      updatedTransactions = statementData.transactions.map(t => t.id === transaction.id ? transaction : t);
    }
    onSave({ ...statementData, transactions: updatedTransactions });
    setEditingTransaction(null);
    setIsNewTransaction(false);
  }, [statementData, isNewTransaction, onSave]);

  const handleDeleteTransaction = useCallback((transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = statementData.transactions.filter(t => t.id !== transactionId);
      onSave({ ...statementData, transactions: updatedTransactions });
    }
  }, [statementData, onSave]);
  
  const handleUpdateUserDetails = (updatedDetails) => {
      onSave({...statementData, ...updatedDetails});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-800 truncate hidden md:block">Statement: {statementData.accountTitle}</h2>
        <div className="flex flex-wrap gap-2">
            <button onClick={() => setIsUserDetailsEditorOpen(true)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"><EditIcon className="w-5 h-5"/> Edit Details</button>
            <button onClick={handlePrint} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"><PrintIcon className="w-5 h-5" /> Print PDF</button>
            <button onClick={handleExport} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"><DownloadIcon className="w-5 h-5"/> Export Excel</button>
            <button onClick={handleImportClick} className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"><UploadIcon className="w-5 h-5"/> Import Excel</button>
            <input type="file" ref={importFileRef} onChange={handleFileImport} accept=".xlsx, .xls" className="hidden" />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
          <div className="statement-container-scaler">
            <StatementPreview 
                statementData={statementData} 
                transactionsWithBalance={transactionsWithBalance} 
                summary={summary}
            />
          </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Manage Transactions</h3>
          <button onClick={() => { setIsNewTransaction(true); setEditingTransaction({ id: '', transDate: '', valueDate: '', description: '', debit: 0, credit: 0 }); }} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <PlusIcon className="w-5 h-5" /> Add Transaction
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Debit</th>
                <th scope="col" className="px-6 py-3">Credit</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statementData.transactions.map(tx => (
                <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-pre-line">{tx.transDate}</td>
                  <td className="px-6 py-4 whitespace-pre-line">{tx.description}</td>
                  <td className="px-6 py-4 text-right">{tx.debit.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">{tx.credit.toFixed(2)}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => { setIsNewTransaction(false); setEditingTransaction(tx); }} className="text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteTransaction(tx.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {(editingTransaction) && (
        <TransactionForm
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveTransaction}
          transaction={editingTransaction}
          isNew={isNewTransaction}
        />
      )}
      
      {isUserDetailsEditorOpen && (
        <UserForm
            isOpen={isUserDetailsEditorOpen}
            onClose={() => setIsUserDetailsEditorOpen(false)}
            onSave={handleUpdateUserDetails}
            existingData={statementData}
        />
      )}
    </div>
  );
};

const App = () => {
  const [statements, setStatements] = useLocalStorage('bankStatements', [initialStatementData]);
  const [selectedStatementId, setSelectedStatementId] = useState(statements.length > 0 ? statements[0].id : null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const selectedStatement = statements.find(s => s.id === selectedStatementId);

  const { transactionsWithBalance, summary } = useMemo(() => {
    if (!selectedStatement) {
        return { 
            transactionsWithBalance: [], 
            summary: { totalDebit: 0, totalCredit: 0, debitCount: 0, creditCount: 0, closingBalance: 0 } 
        };
    }
    let balance = selectedStatement.openingBalance;
    let totalDebit = 0;
    let totalCredit = 0;
    let debitCount = 0;
    let creditCount = 0;

    const calculatedTransactions = selectedStatement.transactions.map(tx => {
      balance += tx.credit - tx.debit;
      totalDebit += tx.debit;
      totalCredit += tx.credit;
      if (tx.debit > 0) debitCount++;
      if (tx.credit > 0) creditCount++;
      return { ...tx, balance };
    });
    
    return {
        transactionsWithBalance: calculatedTransactions,
        summary: {
            totalDebit,
            totalCredit,
            debitCount,
            creditCount,
            closingBalance: balance
        }
    };
  }, [selectedStatement]);

  const handleSaveStatement = useCallback((updatedStatement) => {
    setStatements(prev => prev.map(s => s.id === updatedStatement.id ? updatedStatement : s));
  }, [setStatements]);
  
  const handleAddUser = (newUserDetails) => {
    const newUser = {
        ...newUserDetails,
        id: `user_${Date.now()}`,
        transactions: []
    };
    setStatements(prev => [...prev, newUser]);
    setSelectedStatementId(newUser.id);
  };
  
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user and all their transactions?')) {
        setStatements(prev => {
            const newStatements = prev.filter(s => s.id !== userId);
            if (selectedStatementId === userId) {
                setSelectedStatementId(newStatements.length > 0 ? newStatements[0].id : null);
            }
            return newStatements;
        });
    }
  };

  const handleSelectStatement = (id) => {
    setSelectedStatementId(id);
    if(window.innerWidth < 768) { // md breakpoint
        setSidebarOpen(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex h-screen bg-gray-100 text-gray-800 print:hidden">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
          <div className="h-16 flex items-center justify-between border-b border-gray-200 px-4">
            <h1 className="text-xl font-bold text-gray-700">Statements</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {statements.map(statement => (
              <div key={statement.id} className={`group flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedStatementId === statement.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`} onClick={() => handleSelectStatement(statement.id)}>
                <div className="flex items-center space-x-2 truncate">
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium truncate">{statement.accountTitle}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(statement.id); }} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-opacity">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
              <button onClick={() => setIsUserFormOpen(true)} className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-5 h-5 mr-2"/>
                  Add User
              </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white shadow-sm p-2 flex items-center md:hidden">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                <MenuIcon className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold ml-4 truncate">{selectedStatement?.accountTitle || 'No User Selected'}</h2>
            </div>
          <div className="p-4 md:p-6 lg:p-8 flex-1">
            {selectedStatement ? (
              // FIX: Remove 'key' prop to resolve TS error.
              <StatementEditor 
                statementData={selectedStatement} 
                onSave={handleSaveStatement} 
                transactionsWithBalance={transactionsWithBalance}
                summary={summary}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <UserIcon className="w-16 h-16 mx-auto mb-4"/>
                  <h2 className="text-2xl font-semibold">No User Selected</h2>
                  <p>Please select a user from the list or add a new one.</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {isUserFormOpen && (
// FIX: Add existingData prop with null value to satisfy the component's prop requirements for adding a new user.
          <UserForm
            isOpen={isUserFormOpen}
            onClose={() => setIsUserFormOpen(false)}
            onSave={handleAddUser}
            existingData={null}
          />
        )}
      </div>
      <div className="hidden print:block">
        {selectedStatement && (
          <StatementPreview 
            statementData={selectedStatement}
            transactionsWithBalance={transactionsWithBalance}
            summary={summary}
          />
        )}
      </div>
    </React.Fragment>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);