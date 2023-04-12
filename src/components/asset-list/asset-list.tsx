import { AssetItem } from "@/components"
import { Asset } from "@/domain/models"
import styles from "./asset-list.module.scss"

type AssetListProps = {
  assets: Asset[]
}

const AssetList: React.FC<AssetListProps> = ({
  assets
}) => {
  return (
    <ul className={styles.AssetsList}>
      {assets.map(asset => <AssetItem key={asset.id} asset={asset} />)}
    </ul>
  )
}

export default AssetList
