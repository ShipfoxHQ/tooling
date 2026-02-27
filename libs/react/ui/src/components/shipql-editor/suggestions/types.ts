export interface SuggestionItem {
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode | null;
  selected: boolean;
  type?: 'section-header';
}
