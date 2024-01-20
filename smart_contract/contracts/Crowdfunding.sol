// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract Contract {
    enum Statuses { ACTIVE, DEACTIVATED, EXPIRED, FINISHED }
    address owner;
    constructor() public {
        owner = msg.sender;
    }

    modifier ownerOnly {
        require(msg.sender == owner);
        _;
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        Statuses status;
        string statusName;
        bool isRefunded;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.status = Statuses.ACTIVE;
        campaign.statusName = "ACTIVE";

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        campaign.amountCollected = campaign.amountCollected + amount;
    }

    function refundDonators(address[] memory donators, uint256[] memory donations) private {
        for(uint i = 0; i < donators.length; i++) {
            address donator = donators[i];
            uint256 donation = donations[i];
            payable(donator).transfer(donation);
        }
    }

    function deactivateCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        campaign.status = Statuses.DEACTIVATED;
        campaign.statusName = getStatusKey(Statuses.DEACTIVATED);
        refundDonators(campaign.donators, campaign.donations);
        campaign.isRefunded = true;
    }

    function claim(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, 'You need to be the contract owner to claim the funds.');
        require(block.timestamp > campaign.deadline, 'Deadline is not achieved yet.');

        if (campaignShouldBeRefunded(campaign)) {
            refundDonators(campaign.donators, campaign.donations);
            campaign.status = Statuses.DEACTIVATED;
            campaign.statusName = getStatusKey(Statuses.DEACTIVATED);
            campaign.isRefunded = true;
            return;
        }

        payable(campaign.owner).transfer(campaign.amountCollected);
        campaign.status = Statuses.FINISHED;
        campaign.statusName = getStatusKey(Statuses.FINISHED);
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function getCampaign(uint256 _id) public view returns (Campaign memory, bool) {
        Campaign storage campaign = campaigns[_id];
        bool canUserClaimFunds = block.timestamp > campaign.deadline && campaign.amountCollected >= campaign.target;
        return (campaign, canUserClaimFunds);
    }

    function campaignShouldBeRefunded(Campaign memory campaign) private returns (bool) {
        return block.timestamp > campaign.deadline && campaign.amountCollected < campaign.target;
    }

    function getStatusKey(Statuses status) public pure returns (string memory) {
        if (Statuses.ACTIVE == status) return "ACTIVE";
        if (Statuses.DEACTIVATED == status) return "DEACTIVATED";
        if (Statuses.EXPIRED == status) return "EXPIRED";
        if (Statuses.FINISHED == status) return "FINISHED";
        return "";
    }

}