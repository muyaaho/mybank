package com.mybank.pfm.repository;

import com.mybank.pfm.model.Asset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Asset repository
 */
@Repository
public interface AssetRepository extends MongoRepository<Asset, String> {

    List<Asset> findByUserIdAndIsActive(String userId, boolean isActive);

    List<Asset> findByUserIdAndAssetType(String userId, Asset.AssetType assetType);
}
