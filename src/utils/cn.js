// Tiny classname combiner: cn('base', condition && 'extra', 'more') -> 'base extra more'
// Avoids messy template-string conditionals scattered through components.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
