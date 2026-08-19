import { useMediaQuery } from './useMediaQuery';

/**
 * Pointer capability, not screen size.
 *
 * A laptop with a touchscreen and an iPad with a trackpad both break the
 * "small screen = touch" assumption. Cursor-driven skills key off this, never
 * off width: running a pointermove handler on a device with no pointer is pure
 * battery cost with nothing on screen to show for it.
 */
export function useIsTouch(): boolean {
  return !useMediaQuery('(hover: hover) and (pointer: fine)');
}
