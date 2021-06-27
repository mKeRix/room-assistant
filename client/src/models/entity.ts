export default interface Entity {
  id: string
  name: string
  state: string | number | boolean
  attributes: { [key: string]: any }
}
