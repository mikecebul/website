import { DefaultCellComponentProps } from "payload"

const RoleCell = ({ cellData }: DefaultCellComponentProps) => {
  switch (cellData) {
    case 'superAdmin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'editor':
      return 'Editor'
    case 'user':
      return 'User'
    default:
      return cellData
  }
}

export default RoleCell
