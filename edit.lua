local tweenService = game:GetService("TweenService")
local replicatedStorage = game:GetService("ReplicatedStorage")

local biomChange = replicatedStorage:WaitForChild("biomChange")

local function tweenChildren(name, goal, tweenInfo, TweenInfo, isA, changeMaterial)
    for i, v in pairs(script.Parent:GetDescendants()) do
		if name and v.Name ~= name then continue end
		if isA and not v:IsA(isA) then continue end
		if changeMaterial then v.Material = Enum.Material.Grass end

		tweenService:Create(v, tweenInfo or TweenInfo.new(1), goal):Play()

		task.wait()
	end
end

biomChange.OnServerEvent:Connect(function(player, Name)
	game.ReplicatedStorage:WaitForChild("Styles"):FindFirstChild(Name).Parent = workspace

	tweenChildren("Ground", {Color = Color3.fromRGB(14, 124, 14)}, nil, nil, nil, true)
	tweenChildren("1", {Transparency = 1})
	tweenChildren("2", {Transparency = 1}, TweenInfo.new(1.5))
	tweenChildren(nil, {Transparency = 1}, nil, "SelectionBox")
	tweenChildren("2", {Color3 = Color3.fromRGB(255, 255, 255)}, nil, "SelectionBox")
end)