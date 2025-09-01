// Regex for Latin + German letters
export const NAME_TOKEN_REGEX = /^[A-Za-zÄÖÜäöüß]+$/;
export const LAST_NAME_REGEX = /^[A-Za-zÄÖÜäöüß]+(?:[ \-][A-Za-zÄÖÜäöüß]+)*$/;

// E.164 phone
export const E164_REGEX = /^\+[1-9]\d{1,14}$/;

// Calculate age from date of birth
export function calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
  