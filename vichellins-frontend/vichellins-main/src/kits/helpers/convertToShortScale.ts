export function convertToShortScale(number: number): string {
    if (Math.abs(number) > 999 && Math.abs(number) < 999999) {
      const result = Math.sign(number) * (Math.abs(number) / 1000);
      return (Math.round(result * 10) / 10).toString() + "k";
    } else if (Math.abs(number) > 999999) {
      const result = Math.sign(number) * (Math.abs(number) / 1000000);
      return (Math.round(result * 10) / 10).toString() + "M";
    }
    return (Math.sign(number) * Math.abs(number)).toString();
  }
