import dayjs from 'dayjs';

export function createBookingNo() {
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `BK${dayjs().format('YYYYMMDDHHmmss')}${random}`;
}

