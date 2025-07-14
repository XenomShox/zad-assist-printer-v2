export type TMachine = {
  id: string;
  name: string;
  number: string;
  type: string;
  manufacturer: string;
  production_year: string;
  expiration_year: string;
  def_clamping_force: number;
  def_screw_diameter: number;
  def_screw_stroke: number;
  def_shot_volume: number;
  def_max_sys_pressure: number;
  def_space_tie_bars: string;
  def_mold_thickness: string;
  def_injection_pressure: number;
  def_doc_index: string;
  def_images_index: string;
  company: number;
};

export type TMaterial = {
  id: string;
  type: string;
  quantity: number;
  melt_density: number;
};
