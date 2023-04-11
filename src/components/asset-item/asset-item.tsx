import Image from "next/image"
import Link from "next/link"
import { Asset } from "@/pages/assets"
import { FiAlertCircle, FiAlertTriangle, FiActivity } from "react-icons/fi"
import { Tag, Progress } from "antd"
import styles from "./asset-item.module.scss"

type AssetItemProps = {
  asset: Asset
}

const AssetItem: React.FC<AssetItemProps> = ({ asset }) => {
  return (
    <div className={styles.liContainer} key={asset.id}>
      <li>
        <Image
          width={192}
          height={192}
          src={asset.image}
          alt={asset.name}
          style={{ objectFit: "cover" }}
        />

        <div className={styles.content}>
          <div className={styles.assetDetails}>
            <header>
              <Link href={`/assets/${asset.id}`}>
                {asset.name}
              </Link>

              {asset.status == "inOperation" ? (
                <FiActivity
                  size={30}
                  color="#2ecc71"
                  title={"Em operação"}
                />
              ) : asset.status == "inAlert" ? (
                <FiAlertTriangle
                  size={30}
                  color="#f1c40f"
                  title={"Em alerta"}
                />
              ) : (
                <FiAlertCircle
                  size={30}
                  color="#e74c3c"
                  title={"Em tempo de inatividade"}
                />
              )}
            </header>

            <label htmlFor="specifications.power"></label>
            {typeof asset.specifications.power != "undefined" ? (
              <p id="specifications.power">
                {"Potência de " + asset.specifications.power}kWh
              </p>
            ) : (
              ""
            )}

            <Tag
              color={
                asset.specifications.maxTemp >= 80
                  ? "volcano"
                  : "orange"
              }
              style={{ fontSize: 17 }}
            >
              {asset.specifications.maxTemp}&#8451;
            </Tag>
          </div>
        </div>
      </li>
      <div className={styles.healthScore}>
        <Progress percent={asset.healthscore} status="active" />
      </div>
    </div>
  )
}

export default AssetItem
