import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

export function cln(...inputs: any[]) {
  return twMerge(classNames(...inputs));
}