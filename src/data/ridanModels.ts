/** Модель паяного ПТО Ридан (каталог RC.HE.31.01, май 2024) */
export interface RidanModel {
  /** Артикул для заказа */
  code: string;
  /** Серия (XB25R, XB26R, ...) */
  series: string;
  /** Количество пластин */
  plates: number;
  /** Площадь теплообмена, м² */
  area: number;
  /** Масса, кг */
  mass: number;
  /** Присоединение (G¾, G1, G2) */
  connection: string;
  /** PN, бар */
  pn: number;
  /** Tmax, °C */
  tmax: number;
}

/** Все модели паяных ПТО Ридан серии XB из каталога */
export const RIDAN_MODELS: RidanModel[] = [
  // XB25R
  { code: '004B2037R', series: 'XB25R', plates: 10, area: 0.22, mass: 1.86, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2038R', series: 'XB25R', plates: 16, area: 0.39, mass: 2.4, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2039R', series: 'XB25R', plates: 20, area: 0.5, mass: 2.76, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2041R', series: 'XB25R', plates: 26, area: 0.67, mass: 3.3, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2042R', series: 'XB25R', plates: 30, area: 0.78, mass: 3.66, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2043R', series: 'XB25R', plates: 36, area: 0.95, mass: 4.2, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2044R', series: 'XB25R', plates: 40, area: 1.06, mass: 4.56, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2046R', series: 'XB25R', plates: 50, area: 1.34, mass: 5.46, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2047R', series: 'XB25R', plates: 60, area: 1.62, mass: 6.36, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2048R', series: 'XB25R', plates: 70, area: 1.9, mass: 7.26, connection: 'G¾', pn: 30, tmax: 225 },
  // XB26R
  { code: '004B2025R', series: 'XB26R', plates: 10, area: 0.26, mass: 2.37, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2026R', series: 'XB26R', plates: 16, area: 0.45, mass: 3.03, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2027R', series: 'XB26R', plates: 20, area: 0.58, mass: 3.47, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2028R', series: 'XB26R', plates: 26, area: 0.77, mass: 4.13, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2029R', series: 'XB26R', plates: 30, area: 0.9, mass: 4.57, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2030R', series: 'XB26R', plates: 36, area: 1.09, mass: 5.23, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2031R', series: 'XB26R', plates: 40, area: 1.22, mass: 5.67, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2032R', series: 'XB26R', plates: 50, area: 1.54, mass: 6.77, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2033R', series: 'XB26R', plates: 60, area: 1.86, mass: 7.87, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004B2034R', series: 'XB26R', plates: 70, area: 2.18, mass: 8.97, connection: 'G¾', pn: 30, tmax: 225 },
  // XB30R
  { code: '004H7555R', series: 'XB30R', plates: 10, area: 0.32, mass: 2.64, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7556R', series: 'XB30R', plates: 16, area: 0.56, mass: 3.42, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7557R', series: 'XB30R', plates: 20, area: 0.72, mass: 3.94, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7558R', series: 'XB30R', plates: 26, area: 0.96, mass: 4.72, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7559R', series: 'XB30R', plates: 30, area: 1.12, mass: 5.24, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7560R', series: 'XB30R', plates: 36, area: 1.36, mass: 6.02, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7561R', series: 'XB30R', plates: 40, area: 1.52, mass: 6.54, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7562R', series: 'XB30R', plates: 50, area: 1.92, mass: 7.84, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7563R', series: 'XB30R', plates: 60, area: 2.32, mass: 9.14, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7564R', series: 'XB30R', plates: 70, area: 2.72, mass: 10.44, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7565R', series: 'XB30R', plates: 80, area: 3.12, mass: 11.74, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7566R', series: 'XB30R', plates: 90, area: 3.52, mass: 13.04, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7567R', series: 'XB30R', plates: 100, area: 3.92, mass: 14.34, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7568R', series: 'XB30R', plates: 110, area: 4.32, mass: 15.64, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7569R', series: 'XB30R', plates: 120, area: 4.72, mass: 16.94, connection: 'G¾', pn: 30, tmax: 225 },
  { code: '004H7570R', series: 'XB30R', plates: 140, area: 5.52, mass: 19.54, connection: 'G¾', pn: 30, tmax: 225 },
  // XB60R
  { code: '004H7300R', series: 'XB60R', plates: 10, area: 0.53, mass: 3.9, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7301R', series: 'XB60R', plates: 16, area: 0.92, mass: 5.16, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7302R', series: 'XB60R', plates: 20, area: 1.19, mass: 6.0, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7303R', series: 'XB60R', plates: 26, area: 1.58, mass: 7.26, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7304R', series: 'XB60R', plates: 30, area: 1.85, mass: 8.1, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7305R', series: 'XB60R', plates: 36, area: 2.24, mass: 9.36, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7306R', series: 'XB60R', plates: 40, area: 2.51, mass: 10.2, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7307R', series: 'XB60R', plates: 50, area: 3.17, mass: 12.3, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7308R', series: 'XB60R', plates: 60, area: 3.83, mass: 14.4, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7309R', series: 'XB60R', plates: 70, area: 4.49, mass: 16.5, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7310R', series: 'XB60R', plates: 80, area: 5.15, mass: 18.6, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7311R', series: 'XB60R', plates: 90, area: 5.81, mass: 20.7, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7312R', series: 'XB60R', plates: 100, area: 6.47, mass: 22.8, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7313R', series: 'XB60R', plates: 110, area: 7.13, mass: 24.9, connection: 'G1', pn: 30, tmax: 225 },
  { code: '004H7314R', series: 'XB60R', plates: 120, area: 7.79, mass: 27.0, connection: 'G1', pn: 30, tmax: 225 },
  // XB95R
  { code: '004B1920R', series: 'XB95R', plates: 30, area: 3.08, mass: 15.44, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1921R', series: 'XB95R', plates: 36, area: 3.74, mass: 17.62, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1922R', series: 'XB95R', plates: 40, area: 4.18, mass: 19.08, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1923R', series: 'XB95R', plates: 50, area: 5.28, mass: 22.72, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1932R', series: 'XB95R', plates: 60, area: 6.38, mass: 26.36, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1933R', series: 'XB95R', plates: 70, area: 7.48, mass: 30, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1934R', series: 'XB95R', plates: 80, area: 8.58, mass: 33.64, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1936R', series: 'XB95R', plates: 90, area: 9.68, mass: 37.28, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1937R', series: 'XB95R', plates: 100, area: 10.78, mass: 40.92, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1938R', series: 'XB95R', plates: 110, area: 11.88, mass: 44.56, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1939R', series: 'XB95R', plates: 120, area: 12.98, mass: 48.2, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1940R', series: 'XB95R', plates: 140, area: 15.18, mass: 55.48, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1941R', series: 'XB95R', plates: 160, area: 17.38, mass: 62.76, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1942R', series: 'XB95R', plates: 180, area: 19.58, mass: 70.04, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1943R', series: 'XB95R', plates: 200, area: 21.78, mass: 77.32, connection: 'G2', pn: 30, tmax: 225 },
  // XB120R
  { code: '004B1925R', series: 'XB120R', plates: 30, area: 3.92, mass: 19.81, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1926R', series: 'XB120R', plates: 36, area: 4.76, mass: 22.4, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1927R', series: 'XB120R', plates: 40, area: 5.32, mass: 24.12, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1928R', series: 'XB120R', plates: 50, area: 6.72, mass: 28.43, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1929R', series: 'XB120R', plates: 60, area: 8.12, mass: 32.74, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1930R', series: 'XB120R', plates: 70, area: 9.52, mass: 37.05, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B1931R', series: 'XB120R', plates: 80, area: 10.92, mass: 41.36, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3452R', series: 'XB120R', plates: 90, area: 12.32, mass: 45.67, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3453R', series: 'XB120R', plates: 100, area: 13.72, mass: 49.98, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3454R', series: 'XB120R', plates: 110, area: 15.12, mass: 54.29, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3455R', series: 'XB120R', plates: 120, area: 16.52, mass: 55.6, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3456R', series: 'XB120R', plates: 140, area: 19.32, mass: 67.22, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3457R', series: 'XB120R', plates: 160, area: 22.12, mass: 75.84, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3458R', series: 'XB120R', plates: 180, area: 24.92, mass: 84.46, connection: 'G2', pn: 30, tmax: 225 },
  { code: '004B3459R', series: 'XB120R', plates: 200, area: 27.72, mass: 93.08, connection: 'G2', pn: 30, tmax: 225 },
];
