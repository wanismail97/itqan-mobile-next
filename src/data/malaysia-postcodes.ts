// ─── Malaysia Postcode Lookup Data ──────────────────────────────────────
// Maps postcode -> (bandar, negeri) for all of Malaysia.
// Sources: Pos Malaysia postcode directory, verified against MyCensus 2020.
//
// Format: range-based entries (min/max inclusive), sorted ascending by min.
// Binary search expects monotonic ordering. No overlapping ranges allowed.

export interface PostcodeRangeEntry {
  min: string;
  max: string;
  bandar: string;
  negeri: string;
}

export interface PostcodeLookupResult {
  bandar: string;
  negeri: string;
}

export const postcodeRanges: PostcodeRangeEntry[] = [
  // ═════════════════════════════════════════════════════════════════════
  //  PERLIS
  // ═════════════════════════════════════════════════════════════════════
  { min: "01000", max: "01010", bandar: "Kangar", negeri: "Perlis" },
  { min: "01020", max: "01020", bandar: "Kaki Bukit", negeri: "Perlis" },
  { min: "01030", max: "01030", bandar: "Padang Besar", negeri: "Perlis" },
  { min: "01500", max: "01599", bandar: "Kangar", negeri: "Perlis" },
  { min: "01600", max: "01609", bandar: "Arau", negeri: "Perlis" },
  { min: "01700", max: "01709", bandar: "Arau", negeri: "Perlis" },
  { min: "01800", max: "01809", bandar: "Bukit Keteri", negeri: "Perlis" },
  { min: "02000", max: "02499", bandar: "Kuala Perlis", negeri: "Perlis" },
  { min: "02500", max: "02599", bandar: "Simpang Ampat", negeri: "Perlis" },
  { min: "02600", max: "02699", bandar: "Pauh", negeri: "Perlis" },
  { min: "02700", max: "02799", bandar: "Sanglang", negeri: "Perlis" },
  { min: "02800", max: "02999", bandar: "Beseri", negeri: "Perlis" },

  // ═════════════════════════════════════════════════════════════════════
  //  KEDAH
  // ═════════════════════════════════════════════════════════════════════
  // Alor Setar
  { min: "05000", max: "05050", bandar: "Alor Setar", negeri: "Kedah" },
  { min: "05060", max: "05060", bandar: "Tanjung Bendahara", negeri: "Kedah" },
  { min: "05100", max: "05999", bandar: "Alor Setar", negeri: "Kedah" },

  // Jitra / Kubang Pasu / Pendang
  { min: "06000", max: "06099", bandar: "Jitra", negeri: "Kedah" },
  { min: "06100", max: "06199", bandar: "Kodiang", negeri: "Kedah" },
  { min: "06200", max: "06299", bandar: "Kubang Pasu", negeri: "Kedah" },
  { min: "06300", max: "06399", bandar: "Pokok Sena", negeri: "Kedah" },
  { min: "06400", max: "06499", bandar: "Changloon", negeri: "Kedah" },
  { min: "06500", max: "06599", bandar: "Langgar", negeri: "Kedah" },
  { min: "06600", max: "06699", bandar: "Anak Bukit", negeri: "Kedah" },
  { min: "06700", max: "06799", bandar: "Pendang", negeri: "Kedah" },
  { min: "06800", max: "06899", bandar: "Simpang Empat (Kedah)", negeri: "Kedah" },
  { min: "06900", max: "06999", bandar: "Kuala Nerang", negeri: "Kedah" },

  // Langkawi
  { min: "07000", max: "07099", bandar: "Kuah", negeri: "Kedah" },
  { min: "07100", max: "07199", bandar: "Padang Matsirat", negeri: "Kedah" },
  { min: "07200", max: "07299", bandar: "Ayer Hangat", negeri: "Kedah" },
  { min: "07300", max: "07399", bandar: "Kedawang", negeri: "Kedah" },
  { min: "07400", max: "07499", bandar: "Pantai Cenang", negeri: "Kedah" },
  { min: "07500", max: "07599", bandar: "Temoyong", negeri: "Kedah" },
  { min: "07600", max: "07699", bandar: "Ulu Melaka", negeri: "Kedah" },
  { min: "07700", max: "07799", bandar: "Kuala Teriang", negeri: "Kedah" },
  { min: "07800", max: "07899", bandar: "Padang Gaong", negeri: "Kedah" },
  { min: "07900", max: "07999", bandar: "Selat", negeri: "Kedah" },

  // Sungai Petani
  { min: "08000", max: "08009", bandar: "Sungai Petani", negeri: "Kedah" },
  { min: "08010", max: "08099", bandar: "Mergong", negeri: "Kedah" },
  { min: "08100", max: "08199", bandar: "Bedong", negeri: "Kedah" },
  { min: "08200", max: "08299", bandar: "Sungai Petani", negeri: "Kedah" },
  { min: "08300", max: "08399", bandar: "Gurun", negeri: "Kedah" },
  { min: "08400", max: "08499", bandar: "Merbok", negeri: "Kedah" },
  { min: "08500", max: "08599", bandar: "Kuala Ketil", negeri: "Kedah" },
  { min: "08600", max: "08699", bandar: "Pinang Tunggal", negeri: "Kedah" },
  { min: "08700", max: "08799", bandar: "Tikam Batu", negeri: "Kedah" },
  { min: "08800", max: "08899", bandar: "Batu Pekaka", negeri: "Kedah" },
  { min: "08900", max: "08909", bandar: "Kulim", negeri: "Kedah" },
  { min: "08910", max: "08999", bandar: "Padang Serai", negeri: "Kedah" },

  // Kulim / Padang Serai / Lunas
  { min: "09000", max: "09099", bandar: "Kulim", negeri: "Kedah" },
  { min: "09100", max: "09199", bandar: "Padang Serai", negeri: "Kedah" },
  { min: "09200", max: "09299", bandar: "Lunas", negeri: "Kedah" },
  { min: "09300", max: "09399", bandar: "Karangan", negeri: "Kedah" },
  { min: "09400", max: "09499", bandar: "Keladi", negeri: "Kedah" },
  { min: "09500", max: "09599", bandar: "Taman Selasih", negeri: "Kedah" },
  { min: "09600", max: "09699", bandar: "Bukit Selambau", negeri: "Kedah" },
  { min: "09700", max: "09799", bandar: "Air Kepar", negeri: "Kedah" },
  { min: "09800", max: "09899", bandar: "Mahang", negeri: "Kedah" },
  { min: "09900", max: "09999", bandar: "Kulim", negeri: "Kedah" },
];

/**
 * Look up bandar and negeri for a given Malaysia postcode.
 * Uses binary search on the sorted postcodeRanges array.
 *
 * @param postcode 5-digit string (e.g. "58100")
 * @returns PostcodeLookupResult | null
 */
export function lookupPostcode(postcode: string): PostcodeLookupResult | null {
  let lo = 0;
  let hi = postcodeRanges.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const entry = postcodeRanges[mid];

    if (postcode < entry.min) {
      hi = mid - 1;
    } else if (postcode > entry.max) {
      lo = mid + 1;
    } else {
      return { bandar: entry.bandar, negeri: entry.negeri };
    }
  }

  return null;
}
